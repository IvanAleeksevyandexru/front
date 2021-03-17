import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { OPTIONAL_FIELD } from '../../constants/helper-texts';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../components-list/components-list.types';

@Component({
  selector: 'epgu-constructor-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: ['./component-item.component.scss'],
})
export class ComponentItemComponent implements OnInit, OnChanges {
  @Input() data: AbstractControl;

  @Input() disableLabel = false;
  @Input() disableError = false;
  @Input() disableHint = false;
  @Input() isHalfWidthItem = false;

  readonly componentType = CustomScreenComponentTypes;
  public isHelperTextVisible = false;
  public hint: string;
  public customUnRecLabel: string;
  public hasInfo = false;
  public hasErrors = false;
  public hasUiError = false;
  public hasServerError = false;
  public component: FormControl & CustomComponent;

  ngOnInit(): void {
    this.setState();
  }

  ngOnChanges(): void {
    this.setState();
  }

  private setState(): void {
    this.component = this.data.value;
    this.checkItemHasErrors();
    this.setHints();
    this.setHelperTextVisibility();
    this.checkItemHasInfo();
  }

  private checkItemHasErrors(): void {
    this.hasUiError =
      this.component?.invalid && this.component?.touched && this.component?.hasError
        ? this.component?.hasError('msg')
        : false;
    this.hasServerError = this.component?.hasError
      ? this.component?.hasError('serverError')
      : false;
    this.hasErrors = !this.disableError && (this.hasUiError || this.hasServerError);
  }

  private checkItemHasInfo(): void {
    this.hasInfo = !this.disableHint && (this.isHelperTextVisible || !!this.hint);
  }

  private setHints(): void {
    this.hint = this.component?.attrs?.hint;
    this.customUnRecLabel =
      this.component?.attrs?.customUnrecLabel || this.component?.attrs?.labelHint || OPTIONAL_FIELD;
  }

  private setHelperTextVisibility(): void {
    const isNotCheckBox = this.component?.type !== this.componentType.CheckBox;
    const isNotRequired = !this.component?.required;
    this.isHelperTextVisible =
      ((isNotRequired && isNotCheckBox) || !!this.component?.attrs?.labelHint) &&
      !!this.customUnRecLabel;
  }
}
