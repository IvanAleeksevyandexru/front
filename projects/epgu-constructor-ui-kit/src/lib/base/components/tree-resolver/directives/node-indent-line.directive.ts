import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { animationFrameScheduler, asapScheduler, merge, Subscription } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { TreeNodeComponent } from '../components/node.component';
import { TreeComponent } from '../components/tree.component';
import { getNextSibling, getParent } from '../utils';

function booleanArrayToString(arr: boolean[]): string {
  return arr.map((i) => (i ? 1 : 0)).join('');
}

const BUILD_INDENTS_SCHEDULER =
  typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;

@Directive({
  selector: 'epgu-cf-ui-tree-node[epgu-cf-ui-tree-node-indent-line]',
  host: {
    class: 'tree-show-line',
    '[class.tree-treenode-leaf-last]': 'isLast && isLeaf',
  },
})
export class TreeNodeIndentLineDirective<T> implements OnDestroy {
  isLast: boolean | 'unset' = 'unset';
  isLeaf = false;
  private preNodeRef: T | null = null;
  private nextNodeRef: T | null = null;
  private currentIndents = '';
  private changeSubscription: Subscription;

  constructor(
    private treeNode: TreeNodeComponent<T>,
    private tree: TreeComponent<T>,
    private cdr: ChangeDetectorRef,
  ) {
    this.buildIndents();
    this.checkLast();

    this.changeSubscription = merge(this.treeNode._dataChanges, tree._dataSourceChanged)
      .pipe(auditTime(0, BUILD_INDENTS_SCHEDULER))
      .subscribe(() => {
        this.buildIndents();
        this.checkAdjacent();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.preNodeRef = null;
    this.nextNodeRef = null;
    this.changeSubscription.unsubscribe();
  }

  private getIndents(): boolean[] {
    const indents = [];
    const nodes = this.tree.treeControl.dataNodes;
    const getLevel = this.tree.treeControl.getLevel;
    let parent = getParent(nodes, this.treeNode.data, getLevel);
    while (parent) {
      const parentNextSibling = getNextSibling(nodes, parent, getLevel);
      parentNextSibling ? indents.unshift(true) : indents.unshift(false);
      parent = getParent(nodes, parent, getLevel);
    }
    return indents;
  }

  private buildIndents(): void {
    if (this.treeNode.data) {
      const indents = this.getIndents();
      const diffString = booleanArrayToString(indents);
      if (diffString !== this.currentIndents) {
        this.treeNode.setIndents(this.getIndents());
        this.currentIndents = diffString;
      }
    }
  }

  private checkAdjacent(): void {
    const nodes = this.tree.treeControl.dataNodes;
    const index = nodes.indexOf(this.treeNode.data);
    const preNode = nodes[index - 1] || null;
    const nextNode = nodes[index + 1] || null;
    if (this.nextNodeRef !== nextNode || this.preNodeRef !== preNode) {
      this.checkLast(index);
    }
    this.preNodeRef = preNode;
    this.nextNodeRef = nextNode;
  }

  private checkLast(index?: number): void {
    const nodes = this.tree.treeControl.dataNodes;
    this.isLeaf = this.treeNode.isLeaf;
    this.isLast = !getNextSibling(nodes, this.treeNode.data, this.tree.treeControl.getLevel, index);
  }
}
