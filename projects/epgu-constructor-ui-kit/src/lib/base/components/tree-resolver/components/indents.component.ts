import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-cf-ui-tree-node-indents',
  template: `
    <span
      class="tree-indent-unit"
      [class.tree-indent-unit-end]="!isEnd"
      *ngFor="let isEnd of indents"
    ></span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'tree-indent',
  },
})
export class TreeNodeIndentsComponent {
  @Input() indents: boolean[] = [];
}
