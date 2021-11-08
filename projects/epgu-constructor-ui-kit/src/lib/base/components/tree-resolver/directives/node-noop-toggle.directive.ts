import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';

@Directive({
  selector:
    'epgu-cf-ui-tree-node-toggle:not([epgu-cf-ui-tree-node-noop-toggle]), [epgu-cf-ui-tree-node-noop-toggle]',
  providers: [{ provide: CdkTreeNodeToggle, useExisting: TreeNodeToggleDirective }],
  host: {
    class: 'tree-switcher',
    '[class.tree-switcher_open]': 'isExpanded',
    '[class.tree-switcher_close]': '!isExpanded',
  },
})
export class TreeNodeToggleDirective<T> extends CdkTreeNodeToggle<T> {
  static ngAcceptInputType_recursive: boolean;
  @Input('epgu-cf-ui-tree-node-toggle-recursive')
  get recursive(): boolean {
    return this._recursive;
  }
  set recursive(value: boolean) {
    this._recursive = coerceBooleanProperty(value);
  }

  get isExpanded(): boolean {
    return this._treeNode.isExpanded;
  }
}
