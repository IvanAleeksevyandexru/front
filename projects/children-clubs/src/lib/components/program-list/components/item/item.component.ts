import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppNavigationService } from '@epgu/epgu-constructor-ui-kit';
import { Project } from '../../../../../typings';

@Component({
  selector: 'children-clubs-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../../../../../styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() data: Project;
  constructor(private appNavigationService: AppNavigationService) {}

  show(): void {
    this.appNavigationService.next();
  }
}
