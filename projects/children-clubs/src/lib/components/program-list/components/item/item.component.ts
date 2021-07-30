import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService, MicroAppNavigationService } from '@epgu/epgu-constructor-ui-kit';
import { BaseProgram, FinancingType, financingTypes } from '../../../../typings';

import { StateService } from '../../../../services/state/state.service';

@Component({
  selector: 'children-clubs-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() data: BaseProgram;

  financingType = FinancingType;
  financingTypes = financingTypes;

  constructor(
    public config: ConfigService,
    private appNavigationService: MicroAppNavigationService,
    private stateService: StateService,
  ) {}

  show(): void {
    this.stateService.selectedProgramUUID = this.data.uuid;
    this.appNavigationService.next();
  }
}
