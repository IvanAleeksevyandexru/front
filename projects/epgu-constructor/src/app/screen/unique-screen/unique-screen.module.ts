import { NgModule } from '@angular/core';
import { UniqueScreenComponent } from './unique-screen.component';
import { UniqueScreenComponentsModule } from '../../component/unique-screen/unique-screen-components.module';
import { ComponentsListModule } from '../../component/components-list/components-list.module';
import { UniqueComponentModalModule } from '../../modal/screen-modal/components/unique-component-modal/unique-component-modal.module';
import { AbstractPaymentComponent } from '../../component/unique-screen/components/payment/abstractpayment.component';
import { BaseModule } from '../../shared/base.module';

@NgModule({
  declarations: [UniqueScreenComponent, AbstractPaymentComponent],
  exports: [UniqueScreenComponent],
  imports: [
    BaseModule,
    UniqueScreenComponentsModule,
    ComponentsListModule,
    UniqueComponentModalModule,
  ]
})
export class UniqueScreenModule {}
