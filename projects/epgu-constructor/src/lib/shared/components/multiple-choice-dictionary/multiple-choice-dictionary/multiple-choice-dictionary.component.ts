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
import {
  DictionaryFilters,
  DictionaryOptions,
  DictionaryType,
  Clarifications,
} from '@epgu/epgu-constructor-types';
import { MultiChoiceDictionaryModalComponent } from '../multi-choice-dictionary-modal/multi-choice-dictionary-modal.component';
import {
  CustomComponentDropDownItem,
  MappingParamsDto,
} from '../../../../component/custom-screen/components-list.types';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/services/error-handler/error-handler';
import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { MultipleSelectedItems } from '../multiple-choice-dictionary.models';
import DropDownLikeModel from '../../../../component/custom-screen/component-list-resolver/DropDownLikeModel';

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
  @Input() dictionaryType?: DictionaryType;
  @Input() isReadonly?: boolean;
  @Input() tip?: string;
  @Input() mappingParams?: MappingParamsDto;
  @Input() dictionaryOptions?: DictionaryOptions;
  @Input() clarifications: Clarifications;

  selectedItems: MultipleSelectedItems = { list: [], amount: 0 };

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.dictionaryList) {
      this.dictionaryList = DropDownLikeModel.adaptDropdown(
        this.dictionaryList as CustomComponentDropDownItem[],
      );
    }
  }

  public onClick(): void {
    this.modalService
      .openModal<MultipleSelectedItems | null>(MultiChoiceDictionaryModalComponent, {
        title: this.modalHeader || this.subLabel,
        dictionaryFilter: this.dictionaryFilter,
        dictionaryList: this.dictionaryList,
        dictionaryType: this.dictionaryType,
        selectedItems: this.selectedItems.list,
        dictionaryOptions: this.dictionaryOptions,
        mappingParams: this.mappingParams,
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
        this.writeValue(items as MultipleSelectedItems);
        this.onChange(this.selectedItems);
        this.cdr.markForCheck();
      });
  }

  public remove(id: number | string): void {
    const items = this.selectedItems.list.filter((item) => item.id !== id);
    this.writeValue({
      list: items,
      amount: items.length,
    });
    this.onChange(this.selectedItems);
    this.onTouched();
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(items: MultipleSelectedItems | string): void {
    if (!items) return;
    const value = typeof items === 'string' ? JSON.parse(items) : items;
    this.selectedItems = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-empty-function
  private onChange = (_: ListElement[] | MultipleSelectedItems): void => {};

  // eslint-disable-next-line no-empty-function
  private onTouched = (): void => {};

  private openErrorModal(): Observable<ListElement[]> {
    return this.modalService
      .openModal(ConfirmationModalComponent, COMMON_ERROR_MODAL_PARAMS())
      .pipe(mapTo(this.selectedItems.list));
  }
}
