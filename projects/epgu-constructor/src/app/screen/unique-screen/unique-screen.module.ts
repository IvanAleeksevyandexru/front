import { NgModule } from '@angular/core';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../shared/base.module';
import { UniqueScreenComponent } from './unique-screen.component';
import { ComponentResolverModule } from '../../component/component-resolver/component-resolver.module';
import { AbstractPaymentComponent } from '../../component/unique-screen/components/payment/abstract-payment.component';

@NgModule({
  declarations: [UniqueScreenComponent, AbstractPaymentComponent],
  exports: [UniqueScreenComponent],
  imports: [
    BaseModule,
    ComponentResolverModule,
  ],
  providers: [
    EventBusService,
    DatesToolsService, // TODO: чекнуть нужен ли тут этот сервис?
  ]
})
export class UniqueScreenModule {}
