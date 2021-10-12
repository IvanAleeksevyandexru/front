import { NgModule } from '@angular/core';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../shared/base.module';
import { UniqueScreenComponent } from './unique-screen.component';
import { ComponentUniqueResolverModule } from '../../component/unique-screen/component-unique-resolver/component-unique-resolver.module';
import { AbstractPaymentComponent } from '../../component/unique-screen/components/payment/abstract-payment.component';
import { UniqueScreenComponentsModule } from '../../component/unique-screen/unique-screen-components.module';

@NgModule({
  declarations: [UniqueScreenComponent, AbstractPaymentComponent],
  exports: [UniqueScreenComponent],
  imports: [BaseModule, ComponentUniqueResolverModule, UniqueScreenComponentsModule],
  providers: [
    EventBusService,
    DatesToolsService, // TODO: чекнуть нужен ли тут этот сервис?
  ],
})
export class UniqueScreenModule {}
