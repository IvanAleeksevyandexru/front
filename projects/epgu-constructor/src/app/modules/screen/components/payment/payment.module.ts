import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../shared-module/shared-components.module';
import { PaymentComponent } from './payment.component';

const COMPONENTS = [
	PaymentComponent
];

@NgModule({
	declarations: [...COMPONENTS],
	exports: [...COMPONENTS],
	imports: [
		CommonModule,
		SharedModule,
		EpguLibModule.forChild(),
	]
})
export class PaymentModule { }
