import { CdkTree } from '@angular/cdk/tree';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { TreeNodeOutletDirective } from '../directives/outlet.directive';
import { TreeComponent } from './tree.component';

@Component({
  selector: 'epgu-cf-ui-tree-view',
  exportAs: 'epgu-cf-ui-tree-view',
  template: `
    <div class="tree-list-holder">
      <div class="tree-list-holder-inner">
        <ng-container epgu-cf-ui-tree-node-outlet></ng-container>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: CdkTree, useExisting: TreeViewComponent },
    { provide: TreeComponent, useExisting: TreeViewComponent },
  ],
  host: {
    class: 'tree',
    '[class.tree-block-node]': 'directoryTree || blockNode',
    '[class.tree-directory]': 'directoryTree',
  },
  styles: [
    `
      .tree-list-holder-inner {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class TreeViewComponent<T> extends TreeComponent<T> implements AfterViewInit {
  @ViewChild(TreeNodeOutletDirective, { static: true }) nodeOutlet!: TreeNodeOutletDirective;
  _afterViewInit = false;
  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this._afterViewInit = true;
      this.changeDetectorRef.markForCheck();
    });
  }
}
