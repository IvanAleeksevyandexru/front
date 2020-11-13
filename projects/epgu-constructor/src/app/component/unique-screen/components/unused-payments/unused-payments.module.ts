import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { UnusedPaymentsComponent } from './unused-payments.component';
import { UnusedPaymentsService } from './unused-payments.service';
import { CoreModule } from '../../../../core/core.module';

const COMPONENTS = [
  UnusedPaymentsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [
    UnusedPaymentsService
  ],
  imports: [
    CoreModule,
    SharedModule,
  ]
})
export class UnusedPaymentsModule { }
