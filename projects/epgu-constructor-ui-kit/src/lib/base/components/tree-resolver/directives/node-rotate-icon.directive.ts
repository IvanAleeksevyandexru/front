import { Directive } from '@angular/core';

@Directive({
  selector: '[epgu-cf-ui-icon][epgu-cf-ui-tree-node-toggle-rotate-icon]',
  host: {
    class: 'tree-switcher-icon',
  },
})
export class TreeNodeToggleRotateIconDirective {}
