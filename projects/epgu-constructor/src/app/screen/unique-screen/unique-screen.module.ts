import { NgModule } from '@angular/core';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { AbstractPaymentComponent } from '../../component/unique-screen/components/payment/abstractpayment.component';
import { UniqueScreenComponentsModule } from '../../component/unique-screen/unique-screen-components.module';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UniqueComponentModalModule } from '../../modal/screen-modal/components/unique-component-modal/unique-component-modal.module';
import { BaseModule } from '../../shared/base.module';
import { UniqueScreenComponent } from './unique-screen.component';
import { ComponentResolverModule } from '../../component/component-resolver/component-resolver.module';

@NgModule({
  declarations: [UniqueScreenComponent, AbstractPaymentComponent],
  exports: [UniqueScreenComponent],
  imports: [
    BaseModule,
    UniqueScreenComponentsModule,
    ComponentsListModule,
    UniqueComponentModalModule,
    ComponentResolverModule
  ],
  providers: [
    EventBusService,
    DatesToolsService,
  ]
})
export class UniqueScreenModule {}
