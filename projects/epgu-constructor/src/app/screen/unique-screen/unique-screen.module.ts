import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { CarInfoModule } from './components/car-info/car-info.module';
import { EmployeeHistoryModule } from './components/employee-history/employee-history.module';
import { FileUploadModule } from './components/file-upload-screen/file-upload.module';
import { RepeatableFieldsComponent } from './components/repeatable-fields/repeatable-fields.component';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { UniqueScreenComponent } from './unique-screen.component';
import { TimeSlotsModule } from './components/time-slots/time-slots.module';
import { ScreenService } from '../screen.service';
import { ConfirmMarriageModule } from './components/confirm-marriage/confirm-marriage.module';
import { PaymentModule } from './components/payment/payment.module';
import { UploadAndEditPhotoModule } from './components/upload-and-edit-photo/upload-and-edit-photo.module';


// NOTICE: Avoid using this component, as it's temporary storage solution for to-be-decomposed components
const COMPONENTS = [UniqueScreenComponent];

@NgModule({
  declarations: [
    ...COMPONENTS,
    RepeatableFieldsComponent,
  ],
  exports: [
    ...COMPONENTS,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    EpguLibModule,
    SelectMapObjectModule,
    CarInfoModule,
    EmployeeHistoryModule,
    TimeSlotsModule,
    ConfirmMarriageModule,
    PaymentModule,
    UploadAndEditPhotoModule,
  ],
  providers: [
    ScreenService
  ]
})
export class UniqueScreenModule {}
