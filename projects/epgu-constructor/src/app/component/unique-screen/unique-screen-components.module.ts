import { NgModule } from '@angular/core';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../form-player/services/event-bus/event-bus.service';
import { ModalModule } from '../../modal/modal.module';
import { BaseModule } from '../../shared/base.module';
import { BaseComponentsModule } from '../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../shared/components/clone-button/clone-button.module';
import { ScreenContainerModule } from '../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../shared/components/screen-pad/screen-pad.module';
import { WebcamShootModule } from '../../shared/components/webcam-shoot/webcam-shoot.module';
import { ComponentsListModule } from '../components-list/components-list.module';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { CarInfoModule } from './components/car-info/car-info.module';
import { EmployeeHistoryModule } from './components/employee-history/employee-history.module';
import { FileUploadModule } from './components/file-upload-screen/file-upload.module';
import { InformationCenterMvdModule } from './components/information-center-mvd/information-center-mvd.module';
import { PaymentTypeSelectorModule } from './components/payment-type-selector/payment-type-selector.module';
import { BillinfoModule } from './components/payment/components/billinfo/billinfo.module';
import { PaymentModule } from './components/payment/components/payment/payment.module';
import { RepeatableFieldsComponent } from './components/repeatable-fields/repeatable-fields.component';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';
import { SignatureApplicationModule } from './components/signature-application/signature-application.module';
import { TimeSlotsModule } from './components/time-slots/time-slots.module';
import { UnusedPaymentsModule } from './components/unused-payments/unused-payments.module';
import { UploadAndEditPhotoModule } from './components/upload-and-edit-photo/upload-and-edit-photo.module';
import { WebcamService } from './services/webcam/webcam.service';

@NgModule({
  declarations: [RepeatableFieldsComponent],
  imports: [
    BaseModule,
    WebcamShootModule,
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
    BaseComponentsModule,
    ScreenContainerModule,
    ScreenPadModule,
    CloneButtonModule,
    InformationCenterMvdModule,
  ],
  exports: [
    RepeatableFieldsComponent,
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
    InformationCenterMvdModule,
  ],
  providers: [WebcamService, DictionaryApiService, UnsubscribeService, EventBusService],
})
export class UniqueScreenComponentsModule {}
