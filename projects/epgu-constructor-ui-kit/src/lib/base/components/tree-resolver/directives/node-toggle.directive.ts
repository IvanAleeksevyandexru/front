import { Directive } from '@angular/core';

@Directive({
  selector:
    'epgu-cf-ui-tree-node-toggle[epgu-cf-ui-tree-node-noop-toggle], [epgu-cf-ui-tree-node-noop-toggle]',
  host: {
    class: 'tree-switcher tree-switcher-noop',
  },
})
export class TreeNodeNoopToggleDirective {}