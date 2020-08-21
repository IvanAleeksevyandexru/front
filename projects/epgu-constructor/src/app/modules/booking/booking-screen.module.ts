import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import {TimeSlotsModule} from './components/time-slots/time-slots.module';
import {BookingScreenComponent} from './components/root/booking-screen.component';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';


const COMPONENTS = [
  BookingScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    TimeSlotsModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ],
  providers: [
  ]
})
export class BookingScreenModule { }
