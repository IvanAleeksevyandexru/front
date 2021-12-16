import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkTree, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TreeVirtualNodeData } from './node.component';
import { TreeNodeOutletDirective } from '../directives/outlet.directive';
import { TreeComponent } from './tree.component';

const DEFAULT_SIZE = 28;

@Component({
  selector: 'epgu-cf-ui-tree-virtual-scroll-view',
  exportAs: 'epgu-cf-ui-tree-virtual-scroll-view',
  template: `
    <div class="tree-list">
      <cdk-virtual-scroll-viewport
        class="tree-list-holder"
        [itemSize]="itemSize"
        [minBufferPx]="minBufferPx"
        [maxBufferPx]="maxBufferPx"
      >
        <ng-container *cdkVirtualFor="let item of nodes; let i = index; trackBy: innerTrackBy">
          <ng-template epgu-cf-ui-tree-virtual-scroll-node-outlet [data]="item"></ng-template>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </div>
    <ng-container epgu-cf-ui-tree-node-outlet></ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: TreeComponent, useExisting: TreeVirtualScrollViewComponent },
    { provide: CdkTree, useExisting: TreeVirtualScrollViewComponent },
  ],
  host: {
    class: 'tree',
    '[class.tree-block-node]': 'directoryTree || blockNode',
    '[class.tree-directory]': 'directoryTree',
  },
})
export class TreeVirtualScrollViewComponent<T> extends TreeComponent<T> implements OnChanges {
  @ViewChild(TreeNodeOutletDirective, { static: true })
  readonly nodeOutlet!: TreeNodeOutletDirective;
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  readonly virtualScrollViewport!: CdkVirtualScrollViewport;

  @Input() itemSize = DEFAULT_SIZE;
  @Input() minBufferPx = DEFAULT_SIZE * 5;
  @Input() maxBufferPx = DEFAULT_SIZE * 10;
  @Input() trackBy!: TrackByFunction<T>;
  nodes: TreeVirtualNodeData<T>[] = [];
  innerTrackBy: TrackByFunction<TreeVirtualNodeData<T>> = (i) => i;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.trackBy && typeof changes.trackBy.currentValue === 'function') {
      this.innerTrackBy = (index: number, n): void => this.trackBy(index, n.data);
    } else {
      this.innerTrackBy = (i): number => i;
    }
  }

  renderNodeChanges(data: T[] | readonly T[]): void {
    this.nodes = new Array(...data).map((n, i) => this.createNode(n, i));
    this._dataSourceChanged.next();
  }

  private createNode(nodeData: T, index: number): TreeVirtualNodeData<T> {
    const node = this._getNodeDef(nodeData, index);
    const context = new CdkTreeNodeOutletContext<T>(nodeData);
    if (this.treeControl.getLevel) {
      context.level = this.treeControl.getLevel(nodeData);
    } else {
      context.level = 0;
    }
    return {
      data: nodeData,
      context,
      nodeDef: node,
    };
  }
}
