import { CdkTreeNodeDef } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
@Directive({
  selector: '[epgu-cf-ui-tree-node-def]',
  providers: [{ provide: CdkTreeNodeDef, useExisting: TreeNodeDefDirective }],
})
export class TreeNodeDefDirective<T> extends CdkTreeNodeDef<T> {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('epgu-cf-ui-tree-node-defWhen') when!: (index: number, nodeData: T) => boolean;
}
