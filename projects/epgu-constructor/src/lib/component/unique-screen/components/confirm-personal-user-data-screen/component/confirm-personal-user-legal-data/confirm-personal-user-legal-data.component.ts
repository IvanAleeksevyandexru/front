import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmUserLegalData } from '../../confirm-personal-user-data-screen.types';
import { AbstractConfirmPersonalUserDataDirective } from '../abstract-confirm-personal-user-data.directive';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-legal-data',
  templateUrl: './confirm-personal-user-legal-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserLegalDataComponent extends AbstractConfirmPersonalUserDataDirective<
  ConfirmUserLegalData
> {}
