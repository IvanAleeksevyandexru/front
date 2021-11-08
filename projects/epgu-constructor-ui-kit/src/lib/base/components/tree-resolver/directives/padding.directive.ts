import { CdkTreeNodePadding } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[epgu-cf-ui-tree-node-padding]',
  providers: [{ provide: CdkTreeNodePadding, useExisting: TreeNodePaddingDirective }],
})
export class TreeNodePaddingDirective<T> extends CdkTreeNodePadding<T> {
  @Input('epgu-cf-ui-tree-node-padding')
  get level(): number {
    return this._level;
  }
  set level(value: number) {
    this._setLevelInput(value);
  }
}
