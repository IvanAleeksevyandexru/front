import { CdkTreeNode, CdkTreeNodeDef, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

import { TreeComponent } from './tree.component';

export interface TreeVirtualNodeData<T> {
  data: T;
  context: CdkTreeNodeOutletContext<T>;
  nodeDef: CdkTreeNodeDef<T>;
}

@Component({
  selector: 'epgu-cf-ui-tree-node:not([builtin])',
  exportAs: 'epgu-cf-ui-tree-node',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkTreeNode, useExisting: TreeNodeComponent }],
  template: `
    <epgu-cf-ui-tree-node-indents
      [indents]="indents"
      *ngIf="indents.length"
    ></epgu-cf-ui-tree-node-indents>
    <ng-content select="epgu-cf-ui-tree-node-toggle, [epgu-cf-ui-tree-node-toggle]"></ng-content>
    <epgu-cf-ui-tree-node-toggle
      class="tree-leaf-line-icon"
      *ngIf="indents.length && isLeaf"
      epgu-cf-ui-tree-node-noop-toggle
    >
      <span class="tree-switcher-leaf-line"></span>
    </epgu-cf-ui-tree-node-toggle>
    <ng-content select="epgu-cf-ui-tree-node-checkbox"></ng-content>
    <ng-content select="epgu-cf-ui-tree-node-option"></ng-content>
    <ng-content></ng-content>
  `,
  host: {
    '[class.tree-treenode-switcher-open]': 'isExpanded',
    '[class.tree-treenode-switcher-close]': '!isExpanded',
  },
})
export class TreeNodeComponent<T> extends CdkTreeNode<T> implements OnDestroy, OnInit {
  indents: boolean[] = [];
  disabled = false;
  selected = false;
  isLeaf = false;

  constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected tree: TreeComponent<T>,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
  ) {
    super(elementRef, tree);
    this._elementRef.nativeElement.classList.add('tree-treenode');
  }

  ngOnInit(): void {
    this.isLeaf = !this.tree.treeControl.isExpandable(this.data);
  }

  disable(): void {
    this.disabled = true;
    this.updateDisabledClass();
  }

  enable(): void {
    this.disabled = false;
    this.updateDisabledClass();
  }

  select(): void {
    this.selected = true;
    this.updateSelectedClass();
  }

  deselect(): void {
    this.selected = false;
    this.updateSelectedClass();
  }

  setIndents(indents: boolean[]): void {
    this.indents = indents;
    this.cdr.markForCheck();
  }

  private updateSelectedClass(): void {
    if (this.selected) {
      this.renderer.addClass(this.elementRef.nativeElement, 'tree-treenode-selected');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'tree-treenode-selected');
    }
  }

  private updateDisabledClass(): void {
    if (this.disabled) {
      this.renderer.addClass(this.elementRef.nativeElement, 'tree-treenode-disabled');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'tree-treenode-disabled');
    }
  }
}
