import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { UnusedPaymentsComponent } from './unused-payments.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';
import { RadioTaxModule } from '../../../../shared/components/radio-tax/radio-tax.module';

const COMPONENTS = [UnusedPaymentsComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [UnusedPaymentsService],
  imports: [
    CoreModule,
    SharedModule,
    BaseModule,
    ScreenContainerModule,
    NavigationModule,
    RadioTaxModule,
  ],
})
export class UnusedPaymentsModule {}
