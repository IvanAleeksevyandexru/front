import { CdkTreeNodeOutlet, CDK_TREE_NODE_OUTLET_NODE } from '@angular/cdk/tree';
import { Directive, Inject, Optional, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[epgu-cf-ui-tree-node-outlet]',
  providers: [
    {
      provide: CdkTreeNodeOutlet,
      useExisting: TreeNodeOutletDirective,
    },
  ],
})
export class TreeNodeOutletDirective implements CdkTreeNodeOutlet {
  constructor(
    public viewContainer: ViewContainerRef,
    @Inject(CDK_TREE_NODE_OUTLET_NODE) @Optional() public _node?: unknown,
  ) {}
}
