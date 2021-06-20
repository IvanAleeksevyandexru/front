import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AppNavigationService, AppStateService } from '@epgu/epgu-constructor-ui-kit';
import { Project } from '../../../../typings';
import { ChildrenClubsState, ChildrenClubsValue } from '../../../../children-clubs.types';

@Component({
  selector: 'children-clubs-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() data: Project;
  constructor(
    private appNavigationService: AppNavigationService,
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  show(): void {
    this.appStateService.updateState({ selectedProgramUUID: 'newUUID' });
    this.appNavigationService.next();
  }
}
