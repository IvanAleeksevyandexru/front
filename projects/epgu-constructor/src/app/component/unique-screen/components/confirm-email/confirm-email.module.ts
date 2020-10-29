import { NgModule } from '@angular/core';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CoreModule } from '../../../../core/core.module';


@NgModule({
  declarations: [ConfirmEmailComponent],
  exports: [ConfirmEmailComponent],
  imports: [
    CoreModule,
    SharedModule,
  ]
})
export class ConfirmEmailModule { }
