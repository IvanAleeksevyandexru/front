import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project } from '../../../../../typings';

@Component({
  selector: 'children-clubs-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../../../../../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() data: Project;
}
