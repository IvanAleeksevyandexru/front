import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mapTo, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ListElement } from '@epgu/ui/models/dropdown';
import { ModalService } from '@epgu/epgu-constructor-ui-kit';

import { DictionaryFilters } from '@epgu/epgu-constructor-types';

import { COMMON_ERROR_MODAL_PARAMS } from '../../../../core/services/error-handler/error-handler';
import { CustomComponentDropDownItem } from '../../../../component/custom-screen/components-list.types';
import DropDownLikeModel from '../../../../component/custom-screen/component-list-resolver/DropDownLikeModel';

import { ConfirmationModalComponent } from '../../../../modal/confirmation-modal/confirmation-modal.component';
import { ComplexChoiceDictionaryModalComponent } from '../complex-choice-dictionary-modal/complex-choice-dictionary-modal.component';

@Component({
  selector: 'epgu-constructor-complex-choice-dictionary',
  templateUrl: './complex-choice-dictionary.component.html',
  styleUrls: ['./complex-choice-dictionary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComplexChoiceDictionaryComponent),
      multi: true,
    },
  ],
})
export class ComplexChoiceDictionaryComponent implements ControlValueAccessor, OnInit {
  @Input() subLabel: string;
  @Input() modalHeader: string;
  @Input() label: string;
  @Input() dictionaryList?: unknown;
  @Input() dictionaryFilter: DictionaryFilters;
  @Input() dictionaryType?: string;
  @Input() isReadonly?: boolean;
  @Input() tip?: string;

  selectedItems = { list: [], amount: 0 };

  constructor(private modalService: ModalService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.dictionaryList) {
      this.dictionaryList = DropDownLikeModel.adaptDropdown(
        this.dictionaryList as CustomComponentDropDownItem[],
      );
    }
  }

  onClick(): void {
    this.modalService
      .openModal<ListElement[] | null>(ComplexChoiceDictionaryModalComponent, {
        title: this.modalHeader || this.subLabel,
        dictionaryFilter: this.dictionaryFilter,
        dictionaryType: this.dictionaryType,
        selectedItems: this.selectedItems.list,
        dictionaryList: this.dictionaryList,
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
        this.onChange(selectedItems);
        this.cdr.markForCheck();
      });
  }

  remove(id: number | string): void {
    const items = this.selectedItems.list.filter((item) => item.id !== id);
    this.writeValue(items);
    const selectedItems = this.selectedItems.list.length ? this.selectedItems.list : null;
    this.onChange(selectedItems);
    this.onTouched();
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(items: ListElement[] | string): void {
    if (!items) return;
    const value = typeof items === 'string' ? JSON.parse(items) : items;

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
  private onChange = (_: ListElement[]): void => {};
  private onTouched = (): void => {};

  private openErrorModal(): Observable<ListElement[]> {
    return this.modalService
      .openModal(ConfirmationModalComponent, COMMON_ERROR_MODAL_PARAMS)
      .pipe(mapTo(this.selectedItems.list));
  }
}
