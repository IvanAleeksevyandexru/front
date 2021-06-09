import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenModalService } from '../../screen-modal.service';

@Component({
  selector: 'epgu-constructor-info-component-modal',
  templateUrl: './info-component-modal.component.html',
  styleUrls: ['./info-component-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponentModalComponent {
  constructor(public screenService: ScreenService, public screenModalService: ScreenModalService) {}
}
