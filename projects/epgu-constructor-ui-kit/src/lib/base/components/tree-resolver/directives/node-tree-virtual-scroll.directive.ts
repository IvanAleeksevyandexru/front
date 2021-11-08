import { CdkTreeNode, CdkTreeNodeDef, CdkTreeNodeOutletContext } from '@angular/cdk/tree';

import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

interface TreeVirtualNodeData<T> {
  data: T;
  context: CdkTreeNodeOutletContext<T>;
  nodeDef: CdkTreeNodeDef<T>;
}

@Directive({
  selector: '[epgu-cf-ui-tree-virtual-scroll-node-outlet]',
})
export class TreeVirtualScrollNodeOutletDirective<T> implements OnChanges {
  @Input() data!: TreeVirtualNodeData<T>;

  private _viewRef: EmbeddedViewRef<unknown> | null = null;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const recreateView = this.shouldRecreateView(changes);
    if (recreateView) {
      const viewContainerRef = this._viewContainerRef;

      if (this._viewRef) {
        viewContainerRef.remove(viewContainerRef.indexOf(this._viewRef));
      }

      this._viewRef = this.data
        ? viewContainerRef.createEmbeddedView(this.data.nodeDef.template, this.data.context)
        : null;

      if (CdkTreeNode.mostRecentTreeNode && this._viewRef) {
        CdkTreeNode.mostRecentTreeNode.data = this.data.data;
      }
    } else if (this._viewRef && this.data.context) {
      this.updateExistingContext(this.data.context);
    }
  }

  private shouldRecreateView(changes: SimpleChanges): boolean {
    const ctxChange = changes.data;
    return !!changes.data || (ctxChange && this.hasContextShapeChanged(ctxChange));
  }

  private hasContextShapeChanged(ctxChange: SimpleChange): boolean {
    const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
    const currCtxKeys = Object.keys(ctxChange.currentValue || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (prevCtxKeys.indexOf(propName) === -1) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  private updateExistingContext(ctx: unknown): void {
    for (const propName of Object.keys(ctx)) {
      if (this._viewRef !== undefined) {
        this._viewRef.context[propName] = (this.data.context as unknown)[propName];
      }
    }
  }
}
