import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { UnusedPaymentsComponent } from './unused-payments.component';
import { UnusedPaymentsService } from './unused-payments.service';

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
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EpguLibModule,
  ]
})
export class UnusedPaymentsModule { }
