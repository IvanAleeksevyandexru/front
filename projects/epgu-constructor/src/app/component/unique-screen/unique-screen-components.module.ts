import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RepeatableFieldsComponent } from './components/repeatable-fields/repeatable-fields.component';
import { FileUploadModule } from './components/file-upload-screen/file-upload.module';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { CarInfoModule } from './components/car-info/car-info.module';
import { EmployeeHistoryModule } from './components/employee-history/employee-history.module';
import { TimeSlotsModule } from './components/time-slots/time-slots.module';
import { PaymentModule } from './components/payment/components/payment/payment.module';
import { BillinfoModule } from './components/payment/components/billinfo/billinfo.module';
import { UnusedPaymentsModule } from './components/unused-payments/unused-payments.module';
import { SignatureApplicationModule } from './components/signature-application/signature-application.module';
import { UploadAndEditPhotoModule } from './components/upload-and-edit-photo/upload-and-edit-photo.module';
import { WebcamService } from './services/webcam/webcam.service';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { ComponentsListModule } from '../components-list/components-list.module';
import { ModalModule } from '../../modal/modal.module';
import { CoreModule } from '../../core/core.module';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { PaymentTypeSelectorModule } from './components/payment-type-selector/payment-type-selector.module';

// NOTICE: Avoid using this component, as it's temporary storage solution for to-be-decomposed components
const COMPONENTS = [RepeatableFieldsComponent];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    CoreModule,
    SharedModule,
    ModalModule,
    FileUploadModule,
    SelectMapObjectModule,
    CarInfoModule,
    EmployeeHistoryModule,
    TimeSlotsModule,
    PaymentModule,
    BillinfoModule,
    UnusedPaymentsModule,
    SignatureApplicationModule,
    UploadAndEditPhotoModule,
    ComponentsListModule,
    PaymentTypeSelectorModule,
  ],
  exports: [
    ...COMPONENTS,
    UploadAndEditPhotoModule,
    FileUploadModule,
    SelectMapObjectModule,
    CarInfoModule,
    EmployeeHistoryModule,
    TimeSlotsModule,
    PaymentModule,
    BillinfoModule,
    UnusedPaymentsModule,
    SignatureApplicationModule,
    PaymentTypeSelectorModule,
  ],
  providers: [
    WebcamService,
    DictionaryApiService,
    UnsubscribeService
  ]
})
export class UniqueScreenComponentsModule {}
