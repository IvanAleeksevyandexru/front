import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { OPTIONAL_FIELD } from '../../constants/helper-texts';
import { CustomScreenComponentTypes } from '../components-list/components-list.types';

@Component({
  selector: 'epgu-constructor-component-item',
  templateUrl: './component-item.component.html',
  styleUrls: ['./component-item.component.scss'],
})
export class ComponentItemComponent implements OnInit {
  @Input() data: AbstractControl;

  @Input() disableLabel = false;
  @Input() disableError = false;
  @Input() disableHint = false;
  @Input() isHalfWidthItem = false;

  readonly componentType = CustomScreenComponentTypes;
  public isHelperTextVisible = false;
  public customUnRecLabel: string;

  ngOnInit(): void {
    this.setHelperTextVisibility();
    this.setCustomUnRecLabel();
  }

  private setHelperTextVisibility(): void {
    const isNotCheckBox = this.data.value?.type !== this.componentType.CheckBox;
    const isNotRequired = !this.data.value?.required;
    this.isHelperTextVisible =
      (isNotRequired && isNotCheckBox) || this.data.value?.attrs?.labelHint;
  }

  private setCustomUnRecLabel(): void {
    this.customUnRecLabel =
      this.data.value?.attrs?.customUnrecLabel ||
      this.data.value?.attrs?.labelHint ||
      OPTIONAL_FIELD;
  }
}
