import { Directive } from '@angular/core';

@Directive({
  selector: '[epgu-cf-ui-tree-node-toggle-active-icon]',
  host: {
    class: 'tree-switcher tree-switcher-noop',
  },
})
export class TreeNodeToggleActiveIconDirective  {}
