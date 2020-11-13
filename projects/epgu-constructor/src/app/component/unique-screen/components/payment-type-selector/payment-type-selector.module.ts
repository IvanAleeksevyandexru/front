import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../shared/shared.module';
import { PaymentTypeSelectorComponent } from './payment-type-selector.component';
import { CoreModule } from '../../../../core/core.module';

@NgModule({
  declarations: [PaymentTypeSelectorComponent],
  exports: [PaymentTypeSelectorComponent],
  imports: [CommonModule, SharedModule, EpguLibModule, CoreModule],
})
export class PaymentTypeSelectorModule {}
