import { NgModule } from '@angular/core';

import { UniqueComponentModalComponent } from './unique-component-modal.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { CounterModule } from '../../../../shared/directives/counter/counter.module';
import { BaseModule } from '../../../../shared/base.module';
import { ConfirmWithCodeComponent } from './confirm-with-phone/confirm-with-code.component';
import { FormatPhoneModule, FormatTimeModule } from '@epgu/ui/pipes';

@NgModule({
  declarations: [UniqueComponentModalComponent, ConfirmWithCodeComponent, ConfirmEmailComponent],
  exports: [UniqueComponentModalComponent, ConfirmWithCodeComponent],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    CounterModule,
    FormatPhoneModule,
    FormatTimeModule,
  ],
  entryComponents: [UniqueComponentModalComponent],
})
export class UniqueComponentModalModule {}
