import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Smev2Service } from '../../services/api/smev2/smev2.service';
import { Smev3Service } from '../../services/api/smev3/smev3.service';
import { SlotsService } from '../../services/slots/slots.service';
import { StateService } from '../../services/state/state.service';
import { ErrorService } from '../../services/error/error.service';

@Component({
  selector: 'epgu-constructor-date-time-selector-container',
  templateUrl: './date-time-selector-container.component.html',
  styleUrls: ['./date-time-selector-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [Smev2Service, Smev3Service, SlotsService, StateService, ErrorService],
})
export class DateTimeSelectorContainerComponent {}
