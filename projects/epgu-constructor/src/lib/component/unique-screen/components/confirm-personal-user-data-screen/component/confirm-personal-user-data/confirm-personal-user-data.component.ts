import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActionType, ScenarioErrorsDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService, SessionStorageService } from '@epgu/epgu-constructor-ui-kit';
import {
  ConfirmUserData,
  ConfirmUserDataError,
} from '../../confirm-personal-user-data-screen.types';
import { AbstractConfirmPersonalUserDataDirective } from '../abstract-confirm-personal-user-data.directive';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data',
  templateUrl: './confirm-personal-user-data.component.html',
  styleUrls: ['../confirm-personal.styles.scss'],
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
      this.screenService?.cycledApplicantAnswerContext?.cycledApplicantAnswerItem?.id || '',
    );
    this.screenService.getStore$().subscribe((store) => this.updateErrors(store.errors));
  }

  updateErrors(errors: ScenarioErrorsDto): void {
    const error = errors[this.screenService?.component?.id];
    if (typeof error === 'string' && !this.errors.find(({ desc }) => desc === error)) {
      this.errors.push({
        type: 'error',
        title: 'Ошибка',
        desc: error,
      } as ConfirmUserDataError);
    }
  }
}
