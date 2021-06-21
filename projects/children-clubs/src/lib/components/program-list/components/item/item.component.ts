import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AppNavigationService,
  AppStateQuery,
  AppStateService,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseProgram } from '../../../../typings';
import { ChildrenClubsState, ChildrenClubsValue } from '../../../../children-clubs.types';

@Component({
  selector: 'children-clubs-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() data: BaseProgram;
  constructor(
    private appNavigationService: AppNavigationService,
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
  ) {}

  show(): void {
    this.appStateService.updateState({
      ...this.stateQuery.state,
      selectedProgramUUID: this.data.uuid,
    });
    this.appNavigationService.next();
  }
}
