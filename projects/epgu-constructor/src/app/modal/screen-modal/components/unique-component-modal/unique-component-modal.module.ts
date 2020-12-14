import { NgModule } from '@angular/core';
import { ConfirmPhoneComponent } from './confirm-phone/confirm-phone.component';
import { CoreModule } from '../../../../core/core.module';
import { UniqueComponentModalComponent } from './unique-component-modal.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { CounterModule } from '../../../../shared/directives/counter/counter.module';

@NgModule({
  declarations: [UniqueComponentModalComponent, ConfirmPhoneComponent, ConfirmEmailComponent],
  exports: [UniqueComponentModalComponent, ConfirmPhoneComponent],
  imports: [CoreModule, ConstructorPlainInputModule, CounterModule],
})
export class UniqueComponentModalModule {}
