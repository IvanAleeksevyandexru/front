import { NgModule } from '@angular/core';
import { ConfirmPhoneComponent } from './confirm-phone/confirm-phone.component';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { UniqueComponentModalComponent } from './unique-component-modal.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

@NgModule({
  declarations: [UniqueComponentModalComponent, ConfirmPhoneComponent, ConfirmEmailComponent],
  exports: [UniqueComponentModalComponent, ConfirmPhoneComponent],
  imports: [CoreModule, SharedModule],
})
export class UniqueComponentModalModule {}
