import { NgModule } from '@angular/core';
import { ConfirmPhoneComponent } from './confirm-phone/confirm-phone.component';
import { UniqueComponentModalComponent } from './unique-component-modal.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { CounterModule } from '../../../../shared/directives/counter/counter.module';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [UniqueComponentModalComponent, ConfirmPhoneComponent, ConfirmEmailComponent],
  exports: [UniqueComponentModalComponent, ConfirmPhoneComponent],
  imports: [BaseModule, ConstructorPlainInputModule, CounterModule],
  entryComponents: [UniqueComponentModalComponent]
})
export class UniqueComponentModalModule {}
