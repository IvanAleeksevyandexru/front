import { NgModule } from '@angular/core';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { AbstractPaymentComponent } from '../../component/unique-screen/components/payment/abstractpayment.component';
import { UniqueScreenComponentsModule } from '../../component/unique-screen/unique-screen-components.module';
import { EventBusService } from '../../form-player/services/event-bus/event-bus.service';
import { UniqueComponentModalModule } from '../../modal/screen-modal/components/unique-component-modal/unique-component-modal.module';
import { BaseModule } from '../../shared/base.module';
import { UniqueScreenComponent } from './unique-screen.component';

@NgModule({
  declarations: [UniqueScreenComponent, AbstractPaymentComponent],
  exports: [UniqueScreenComponent],
  imports: [
    BaseModule,
    UniqueScreenComponentsModule,
    ComponentsListModule,
    UniqueComponentModalModule,
  ],
  providers: [EventBusService]
})
export class UniqueScreenModule {}
