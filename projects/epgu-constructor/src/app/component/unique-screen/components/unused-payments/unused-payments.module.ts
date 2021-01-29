import { NgModule } from '@angular/core';
import { UnusedPaymentsContainerComponent } from './unused-payments-container.component';
import { UnusedPaymentsComponent } from './component/unused-payments.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';
import { RadioTaxModule } from '../../../../shared/components/radio-tax/radio-tax.module';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [UnusedPaymentsContainerComponent, UnusedPaymentsComponent],
  exports: [UnusedPaymentsContainerComponent],
  providers: [UnusedPaymentsService],
  imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, NavigationModule, RadioTaxModule],
  entryComponents: [UnusedPaymentsContainerComponent]
})
export class UnusedPaymentsModule {}
