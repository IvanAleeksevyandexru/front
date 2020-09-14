import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { UnusedPaymentsComponent } from './unused-payments.component';

const COMPONENTS = [
  UnusedPaymentsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EpguLibModule,
  ]
})
export class UnusedPaymentsModule { }
