import { BidiModule } from '@angular/cdk/bidi';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BaseUiModule } from '../../base-ui.module';

import { ConstructorCheckboxModule } from '../constructor-checkbox/constructor-checkbox.module';

import { TreeNodeCheckboxComponent } from './components/checkbox.component';
import { TreeNodeIndentsComponent } from './components/indents.component';
import { TreeNodeComponent } from './components/node.component';
import { TreeNodeOptionComponent } from './components/option.component';
import { TreeComponent } from './components/tree.component';
import { TreeViewComponent } from './components/tree-view.component';

import { TreeNodeDefDirective } from './directives/node-def.directive';
import { TreeNodeIndentLineDirective } from './directives/node-indent-line.directive';
import { TreeNodeToggleDirective } from './directives/node-noop-toggle.directive';
import { TreeNodeToggleRotateIconDirective } from './directives/node-rotate-icon.directive';
import { TreeNodeNoopToggleDirective } from './directives/node-toggle.directive';
import { TreeVirtualScrollNodeOutletDirective } from './directives/node-tree-virtual-scroll.directive';
import { TreeNodeOutletDirective } from './directives/outlet.directive';
import { TreeNodePaddingDirective } from './directives/padding.directive';
import { TreeNodeToggleActiveIconDirective } from './directives/node-active-icon.directive';

const treeWithControlComponents = [
  TreeNodeCheckboxComponent,
  TreeNodeIndentsComponent,
  TreeNodeComponent,
  TreeNodeOptionComponent,
  TreeComponent,
  TreeViewComponent,
  TreeNodeDefDirective,
  TreeNodeIndentLineDirective,
  TreeNodeToggleDirective,
  TreeNodeToggleRotateIconDirective,
  TreeNodeNoopToggleDirective,
  TreeVirtualScrollNodeOutletDirective,
  TreeNodeOutletDirective,
  TreeNodePaddingDirective,
  TreeNodeToggleActiveIconDirective,
];

@NgModule({
  imports: [BidiModule, CommonModule, ScrollingModule, BaseUiModule, ConstructorCheckboxModule],
  declarations: [treeWithControlComponents],
  exports: [treeWithControlComponents],
})
export class TreeResolverModule {}
