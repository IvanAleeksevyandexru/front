import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConfirmPersonalUserDataComponent } from '../confirm-personal-user-data/confirm-personal-user-data.component';
import { ConfirmUserLegalData } from '../../confirm-personal-user-data-screen.types';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-legal-data',
  templateUrl: './confirm-personal-user-legal-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserLegalDataComponent extends ConfirmPersonalUserDataComponent {
  component$: Observable<ConfirmUserLegalData> = this.screenService.component$ as Observable<
    ConfirmUserLegalData
  >;
}
