import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { BaseProgram, financingTypes } from '../../../../models/children-clubs.types';
import { ProgramListService } from '../../../../services/program-list/program-list.service';

@Component({
  selector: 'epgu-constructor-cc-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss', '../../../../../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() data: BaseProgram;

  public financingTypes = financingTypes;

  constructor(public config: ConfigService, private programListService: ProgramListService) {}

  public show(): void {
    const { uuid } = this.data;
    this.programListService.selectProgram(uuid);
  }
}
