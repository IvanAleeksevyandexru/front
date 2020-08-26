import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { PaymentComponent } from './payment.component';
import { SharedModule } from '../../../../shared-module/shared-components.module';

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
