import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../shared/shared.module';
import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { CoreModule } from '../../../../core/core.module';
import { ScreenService } from '../../../../screen/screen.service';

@NgModule({
  declarations: [PaymentTypeSelectorComponent],
  exports: [PaymentTypeSelectorComponent],
  providers: [ScreenService],
  imports: [CommonModule, SharedModule, EpguLibModule, CoreModule],
})
export class PaymentTypeSelectorModule {}
