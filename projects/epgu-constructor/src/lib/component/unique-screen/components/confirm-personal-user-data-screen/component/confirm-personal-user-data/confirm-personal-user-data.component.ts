import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionType } from '@epgu/epgu-constructor-types';
import { UnsubscribeService, SessionStorageService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmUserData } from '../../confirm-personal-user-data-screen.types';
import { AbstractConfirmPersonalUserDataDirective } from '../abstract-confirm-personal-user-data.directive';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['./confirm-personal-user-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserDataComponent
  extends AbstractConfirmPersonalUserDataDirective<ConfirmUserData>
  implements OnInit {
  actionType = ActionType;
  private readonly sessionStorageService: SessionStorageService = new SessionStorageService();

  ngOnInit(): void {
    super.ngOnInit();
    this.sessionStorageService.setRaw(
      'childId',
      this.screenService.getStore()?.applicantAnswers?.cld1_id?.value || '',
    );
  }
}
