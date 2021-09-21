import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListElement } from '@epgu/ui/models/dropdown';
import { mapTo, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ModalService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryFilters } from '@epgu/epgu-constructor-types';
import { MultiChoiceDictionaryModalComponent } from '../multi-choice-dictionary-modal/multi-choice-dictionary-modal.component';
import { CustomComponentDropDownItem } from '../../../../component/custom-screen/components-list.types';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/services/error-handler/error-handler';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { MultipleSelectedItems } from '../multiple-choice-dictionary.models';

@Component({
  selector: 'epgu-constructor-multiple-choice-dictionary',
  templateUrl: './multiple-choice-dictionary.component.html',
  styleUrls: ['./multiple-choice-dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleChoiceDictionaryComponent),
      multi: true,
    },
  ],
})
export class MultipleChoiceDictionaryComponent implements OnInit, ControlValueAccessor {
  @Input() subLabel: string;
  @Input() modalHeader: string;
  @Input() label: string;
  @Input() dictionaryFilter: DictionaryFilters;
  @Input() dictionaryList?: unknown;
  @Input() dictionaryType?: string;
  @Input() withAmount?: boolean;
  @Input() isReadonly?: boolean;
  @Input() tip?: string;

  selectedItems: MultipleSelectedItems = { list: [], amount: 0 };

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.dictionaryList) {
      this.dictionaryList = this.adaptiveDropDown(
        this.dictionaryList as CustomComponentDropDownItem[],
      );
    }
  }

  public onClick(): void {
    this.modalService
      .openModal<ListElement[] | null>(MultiChoiceDictionaryModalComponent, {
        title: this.modalHeader || this.subLabel,
        dictionaryFilter: this.dictionaryFilter,
        dictionaryList: this.dictionaryList,
        dictionaryType: this.dictionaryType,
        selectedItems: this.selectedItems.list,
      })
      .pipe(
        switchMap((items) => {
          if (items instanceof Error) {
            return this.openErrorModal();
          }
          return of(items || this.selectedItems.list);
        }),
      )
      .subscribe((items) => {
        this.writeValue(items);
        const selectedItems = this.selectedItems.list.length ? this.selectedItems.list : null;
        this.onChange(this.withAmount ? this.selectedItems : selectedItems);
        this.cdr.markForCheck();
      });
  }

  public remove(id: number | string): void {
    const items = this.selectedItems.list.filter((item) => item.id !== id);
    this.writeValue(items);
    const selectedItems = this.selectedItems.list.length ? this.selectedItems.list : null;
    this.onChange(this.withAmount ? this.selectedItems : selectedItems);
    this.onTouched();
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(items: ListElement[] | string): void {
    if (!items) return;
    const value = typeof items === 'string' ? JSON.parse(items) : items;

    // TODO: когда-нибудь value всегда будет объектом, тогда можно будет убрать вторую проверку
    // пока что сохраняем обратную совместимость со старыми json'ами услуг
    if (Array.isArray(value)) {
      this.selectedItems = {
        list: value,
        amount: value.length,
      };
    } else {
      this.selectedItems = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_: ListElement[] | MultipleSelectedItems): void => {};

  private onTouched = (): void => {};

  private openErrorModal(): Observable<ListElement[]> {
    return this.modalService
      .openModal(ConfirmationModalComponent, COMMON_ERROR_MODAL_PARAMS)
      .pipe(mapTo(this.selectedItems.list));
  }

  // TODO: сделать приведение к единому типу данных на бэке
  private adaptiveDropDown(items: CustomComponentDropDownItem[]): ListElement[] {
    return items.map((item: CustomComponentDropDownItem, index: number) => {
      const itemText = item.label || item.title;
      const itemCode = item.code || item?.value || `${itemText}-${index}`;
      return {
        id: itemCode,
        text: itemText,
        unselectable: !!item.disable,
        originalItem: item,
        compare: (): boolean => false,
      };
    });
  }
}
