import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Group } from '../../../../typings';

@Component({
  selector: 'children-clubs-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupItemComponent {
  @Input() data: Group;
  @Input() index: number;
}
