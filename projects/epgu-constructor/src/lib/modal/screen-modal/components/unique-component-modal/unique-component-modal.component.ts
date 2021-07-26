import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UniqueScreenComponentTypes } from '../../../../component/unique-screen/unique-screen-components.types';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-unique-component-modal',
  templateUrl: './unique-component-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniqueComponentModalComponent {
  uniqueComponentName = UniqueScreenComponentTypes;
  confirmWithCodeTypes: string[] = [
    this.uniqueComponentName.phoneNumberConfirmCodeInput,
    this.uniqueComponentName.confirmCodeInput,
    this.uniqueComponentName.confirmEmailCodeInput,
  ];
  confirmEmailTypes: string[] = [
    this.uniqueComponentName.ConfirmNewEmail,
    this.uniqueComponentName.ConfirmLegalNewEmail,
  ];

  constructor(public screenService: ScreenService) {}
}
