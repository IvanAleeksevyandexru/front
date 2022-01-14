import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { AbstractControl } from '@angular/forms';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';
import { SUGGEST_SEPARATOR_DEFAULT } from '../../../core/services/autocomplete/autocomplete.const';
import { Focusable, FocusManager } from '@epgu/ui/services/focus';

@Component({
  selector: 'epgu-constructor-constructor-dadata-widget',
  templateUrl: './constructor-dadata-widget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructorDadataWidgetComponent implements Focusable, AfterViewInit, OnDestroy {
  @Input() simpleMode: boolean;
  @Input() hideLevels?: string[];
  @Input() hideHouseCheckbox: boolean;
  @Input() hideApartmentCheckbox: boolean;
  @Input() selectHouseCheckbox: boolean;
  @Input() selectApartmentCheckbox: boolean;
  @Input() externalApiUrl?: string;
  @Input() id: string;
  @Input() validationShowOn: ValidationShowOn | string | boolean;
  @Input() invalid: boolean;
  @Input() clearable: boolean;
  @Input() control: AbstractControl;
  @Input() suggestions?: ISuggestionItem;
  @Input() name?: string;

  @Output() selectSuggest: EventEmitter<ISuggestionItem | ISuggestionItemList> = new EventEmitter<
    ISuggestionItem | ISuggestionItemList
  >();

  readonly suggestSeparator = SUGGEST_SEPARATOR_DEFAULT;
  controlFocused = false;

  constructor(private focusManager: FocusManager) {}

  public ngAfterViewInit(): void {
    this.focusManager.register(this);
  }

  public ngOnDestroy(): void {
    this.focusManager.unregister(this);
  }

  handleFocus(): void {
    this.controlFocused = true;
  }

  handleBlur(): void {
    this.control.updateValueAndValidity();
    this.controlFocused = false;
  }

  public notifyFocusEvent(e: boolean): void {
    // после focus автоматически срабатывает blur, даже если его не было
    // отлавливаем и игнорируем его
    if (!e && this.focusManager.isJustFocused(this)) {
      return;
    }
    this.focusManager.notifyFocusMayChanged(this, e);
  }
}
