import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'epgu-constructor-priority-item-empty',
  templateUrl: './priority-item-empty.component.html',
  styleUrls: ['./priority-item-empty.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityItemEmptyComponent {
  @Input() index: number;
  @Output() selectItem = new EventEmitter<null>();
}
