import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { TreeNodeComponent } from './node.component';

@Component({
  selector: 'epgu-cf-ui-tree-node-option',
  template: ` <span class="tree-title"><ng-content></ng-content></span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tree-node-content-wrapper',
    '[class.tree-node-content-wrapper-open]': 'isExpanded',
    '[class.tree-node-selected]': 'selected',
    '(click)': 'onClick($event)',
  },
})
export class TreeNodeOptionComponent<T> implements OnChanges {
  static ngAcceptInputType_selected: boolean;
  static ngAcceptInputType_disabled: boolean;

  @Input() selected = false;
  @Input() disabled = false;
  @Output() readonly optionClick = new EventEmitter<MouseEvent>();

  constructor(private treeNode: TreeNodeComponent<T>) {}

  get isExpanded(): boolean {
    return this.treeNode.isExpanded;
  }

  onClick(e: MouseEvent): void {
    if (!this.disabled) {
      this.optionClick.emit(e);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { disabled, selected } = changes;
    if (disabled) {
      if (disabled.currentValue) {
        this.treeNode.disable();
      } else {
        this.treeNode.enable();
      }
    }

    if (selected) {
      if (selected.currentValue) {
        this.treeNode.select();
      } else {
        this.treeNode.deselect();
      }
    }
  }
}
