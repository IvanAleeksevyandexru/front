import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperModule } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { PaymentWayContainerComponent } from './components/payment-way-container/payment-way-container.component';
import { PaymentWayComponent } from './components/payment-way/payment-way.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OutputHtmlModule } from '../../../../shared/components/output-html/output-html.module';
import { PluralizeModule } from '@epgu/ui/pipes';
import { BaseModule } from '../../../../shared/base.module';

@NgModule({
  declarations: [PaymentWayContainerComponent, PaymentWayComponent],
  imports: [
    CommonModule,
    ScreenPadModule,
    DefaultUniqueScreenWrapperModule,
    FormsModule,
    ReactiveFormsModule,
    OutputHtmlModule,
    PluralizeModule,
    BaseModule,
  ],
  entryComponents: [PaymentWayContainerComponent],
})
export class PaymentWayModule {}
