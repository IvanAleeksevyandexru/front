import { NgModule } from '@angular/core';
import { ConfirmPhoneComponent } from './components/confirm-phone/confirm-phone.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';



@NgModule({
  declarations: [ConfirmPhoneComponent],
  exports: [ConfirmPhoneComponent],
  imports: [
    CoreModule,
    SharedModule,
  ]
})
export class ConfirmPhoneModule { }
