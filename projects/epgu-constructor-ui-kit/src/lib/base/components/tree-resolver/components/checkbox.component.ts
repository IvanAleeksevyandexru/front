import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'epgu-cf-ui-tree-node-checkbox:not([builtin])',
  template: `
    <epgu-cf-ui-constructor-constructor-checkbox
      [labelText]="labelText"
      [control]="control"
      [checkboxId]="checkboxId"
    ></epgu-cf-ui-constructor-constructor-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  host: {
    class: 'tree-checkbox',
    '[class.tree-checkbox-checked]': `checked`,
    '[class.tree-checkbox-disabled]': `disabled`,
    '(click)': 'onClick($event)',
  },
})
export class TreeNodeCheckboxComponent {
  static ngAcceptInputType_disabled: boolean;

  @Input() disabled?: boolean;
  @Input() labelText: string;
  @Input() checkboxId: string;
  @Input() control: AbstractControl;
  @Output() readonly treeClick = new EventEmitter<MouseEvent>();

  onClick(e: MouseEvent): void {
    if (!this.disabled) {
      this.treeClick.emit(e);
    }
  }
}
