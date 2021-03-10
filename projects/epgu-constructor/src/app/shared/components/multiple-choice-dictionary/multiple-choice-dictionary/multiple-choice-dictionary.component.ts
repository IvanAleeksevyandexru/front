import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { mapTo, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ModalService } from '../../../../modal/modal.service';
import { MultiChoiceDictionaryModalComponent } from '../multi-choice-dictionary-modal/multi-choice-dictionary-modal.component';
import { CustomComponentDropDownItem } from '../../components-list/components-list.types';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/interceptor/errors/errors.interceptor.constants';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';

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
  @Input() label: string;
  @Input() dictionaryList?: ListElement[] | CustomComponentDropDownItem[];
  @Input() dictionaryType?: string;
  selectedItems: ListElement[] = [];

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
        title: this.subLabel,
        dictionaryList: this.dictionaryList,
        dictionaryType: this.dictionaryType,
        selectedItems: this.selectedItems,
      })
      .pipe(
        switchMap((items) => {
          if (items instanceof Error) {
            return this.openErrorModal();
          }
          return of(items || this.selectedItems);
        }),
      )
      .subscribe((items) => {
        this.writeValue(items);
        this.onChange(items);
        this.cdr.markForCheck();
      });
  }

  public remove(id: number | string): void {
    const items = this.selectedItems.filter((item) => item.id !== id);
    this.writeValue(items);
    this.onChange(items);
    this.onTouched();
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(items: ListElement[]): void {
    if (Array.isArray(items)) {
      this.selectedItems = items;
    } else {
      this.selectedItems = JSON.parse(items || '[]');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (_: ListElement[]): void => {};

  private onTouched = (): void => {};

  private openErrorModal(): Observable<ListElement[]> {
    return this.modalService
      .openModal(ConfirmationModalComponent, COMMON_ERROR_MODAL_PARAMS)
      .pipe(mapTo(this.selectedItems));
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
