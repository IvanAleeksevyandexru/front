import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { WebcamComponent } from 'ngx-webcam';
import { FormPlayerComponent } from './form-player.component';
import { ComponentScreenComponent } from './screen/component-screen/component-screen.component';
// eslint-disable-next-line max-len
import { AddChildrenScreenComponent } from './screen/component-screen/components/add-children/screens/add-children-screen/add-children-screen.component';
// eslint-disable-next-line max-len
import { AddNewChildFormComponent } from './screen/component-screen/components/add-children/sub-components/add-new-child-form/add-new-child-form.component';
import { AddPassportComponent } from './screen/component-screen/components/add-passport/add-passport.component';
// eslint-disable-next-line max-len
import { ChangeListComponent } from './screen/component-screen/components/change-list/change-list.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressScreenComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/confirm-personal-user-address-screen.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataScreenComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserEmailComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-email-screen/components/confirm-personal-user-email/confirm-personal-user-email.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserEmailScreenComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-email-screen/confirm-personal-user-email-screen.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-phone-screen/components/confirm-personal-user-phone/confirm-personal-user-phone.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneScreenComponent } from './screen/component-screen/components/confirm-personal-user/screens/confirm-personal-user-phone-screen/confirm-personal-user-phone-screen.component';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrComponent } from './screen/component-screen/components/confirm-personal-user/screens/temporary-registration-addr/components/temporary-registration-addr/temporary-registration-addr.component';
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrScreenComponent } from './screen/component-screen/components/confirm-personal-user/screens/temporary-registration-addr/temporary-registration-addr-screen.component';
// eslint-disable-next-line max-len
import { AddressItemComponent } from './screen/component-screen/components/confirm-personal-user/sub-components/address-item/address-item.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserButtonComponent } from './screen/component-screen/components/confirm-personal-user/sub-components/confirm-personal-user-button/confirm-personal-user-button.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserScreenLayoutComponent } from './screen/component-screen/components/confirm-personal-user/sub-components/confirm-personal-user-screen-layout/confirm-personal-user-screen-layout.component';
import { CountrySelectionComponent } from './screen/component-screen/components/country-selection/country-selection.component';
import { DocInputComponent } from './screen/component-screen/components/doc-input/doc-input.component';
import { MvdGiacComponent } from './screen/component-screen/components/mvd-giac/mvd-giac.component';
import { SnilsComponent } from './screen/component-screen/components/snils/snils.component';
import { ComponentsListComponent } from './screen/custom-screen/components-list/components-list.component';
import { CustomScreenComponent } from './screen/custom-screen/custom-screen.component';
import { RedirectComponent } from './screen/empty-screen/components/redirect.component';
import { EmptyScreenComponent } from './screen/empty-screen/empty-screen.component';
import { InfoScreenBodyComponent } from './screen/info-screen/component/info-screen-body/info-screen-body.component';
import { InfoScreenComponent } from './screen/info-screen/info-screen.component';
import { InvitationErrorComponent } from './screen/invitation-error-screen/components/error/invitation-error.component';
import { InvitationErrorScreenComponent } from './screen/invitation-error-screen/invitation-error-screen.component';
import { QuestionsScreenComponent } from './screen/questions-screen/questions-screen.component';
import { CarInfoComponent } from './screen/unique-screen/components/car-info/components/car-info-screen/car-info.component';
import { CarInfoAccidentsPipe } from './screen/unique-screen/components/car-info/pipes/car-accidents.pipe';
import { CarInfoDatePipe } from './screen/unique-screen/components/car-info/pipes/car-date-format.pipe';
import { CarInfoLegalPipe } from './screen/unique-screen/components/car-info/pipes/car-info.pipe';
import { CarInfoOwnerPipe } from './screen/unique-screen/components/car-info/pipes/car-owner-type.pipe';
import { CarInfoStatusPipe } from './screen/unique-screen/components/car-info/pipes/car-status.pipe';
import { ConfirmMarriageComponent } from './screen/unique-screen/components/confirm-marriage/components/confirm-marriage.component';
import { TimerComponent } from './screen/unique-screen/components/confirm-marriage/components/timer/timer.component';
import { TimerPipe } from './screen/unique-screen/components/confirm-marriage/pipes/timer.pipe';
import { EmployeeHistoryComponent } from './screen/unique-screen/components/employee-history/employee-history.component';
import { FileUploadScreenComponent } from './screen/unique-screen/components/file-upload-screen/file-upload-screen.component';
// eslint-disable-next-line max-len
import { FileUploadItemComponent } from './screen/unique-screen/components/file-upload-screen/sub-components/file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './screen/unique-screen/components/file-upload-screen/sub-components/file-upload/file-upload.component';
import { PaymentComponent } from './screen/unique-screen/components/payment/payment.component';
import { RepeatableFieldsComponent } from './screen/unique-screen/components/repeatable-fields/repeatable-fields.component';
import { SelectMapObjectComponent } from './screen/unique-screen/components/select-map-object/select-map-object.component';
import { TimeSlotsComponent } from './screen/unique-screen/components/time-slots/time-slots.component';
import { UniqueScreenComponent } from './screen/unique-screen/unique-screen.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { AnswerButtonComponent } from './shared/components/answer-button/answer-button.component';
import { HelperTextComponent } from './shared/components/base/helper-text/helper-text.component';
import { LabelComponent } from './shared/components/base/label/label.component';
import { PageNameComponent } from './shared/components/base/page-name/page-name.component';
import { GenderRadioButtonComponent } from './shared/components/gender-radio-button/gender-radio-button.component';
import { LongButtonComponent } from './shared/components/long-button/long-button.component';
import { ModalContainerComponent } from './shared/components/modal/modal-container/modal-container.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { OutputHtmlComponent } from './shared/components/output-html/output-html.component';
import { ScreenContainerComponent } from './shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from './shared/components/screen-pad/screen-pad.component';
import { NavigationService } from './shared/services/navigation/navigation.service';


describe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModule,
      ],
      declarations: [
        FormPlayerComponent,
        ModalContainerComponentMock,
        InfoScreenComponent,
        InvitationErrorScreenComponent,
        InvitationErrorComponent,
        UniqueScreenComponent,
        QuestionsScreenComponent,
        EmptyScreenComponent,
        CustomScreenComponent,
        ComponentScreenComponent,
        NavigationComponent,
        PageNameComponent,
        InfoScreenBodyComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        LabelComponent,
        SelectMapObjectComponent,
        FileUploadComponent,
        FileUploadScreenComponent,
        FileUploadItemComponent,
        EmployeeHistoryComponent,
        RepeatableFieldsComponent,
        TimeSlotsComponent,
        CarInfoComponent,
        ConfirmMarriageComponent,
        PaymentComponent,
        AnswerButtonComponent,
        OutputHtmlComponent,
        RedirectComponent,
        ComponentsListComponent,
        AddChildrenScreenComponent,
        AddNewChildFormComponent,
        DocInputComponent,
        CountrySelectionComponent,
        SnilsComponent,
        MvdGiacComponent,
        AddPassportComponent,
        TemporaryRegistrationAddrComponent,
        TemporaryRegistrationAddrScreenComponent,
        ConfirmPersonalUserPhoneScreenComponent,
        ConfirmPersonalUserPhoneComponent,
        ConfirmPersonalUserEmailScreenComponent,
        ConfirmPersonalUserEmailComponent,
        ConfirmPersonalUserDataScreenComponent,
        ConfirmPersonalUserDataComponent,
        ConfirmPersonalUserAddressScreenComponent,
        ConfirmPersonalUserAddressComponent,
        ConfirmPersonalUserButtonComponent,
        ConfirmPersonalUserScreenLayoutComponent,
        AddressItemComponent,
        ChangeListComponent,
        WebcamComponent,
        TimerComponent,
        HelperTextComponent,
        GenderRadioButtonComponent,
        LongButtonComponent,
        TimerPipe,
        CarInfoLegalPipe,
        CarInfoOwnerPipe,
        CarInfoDatePipe,
        CarInfoStatusPipe,
        CarInfoAccidentsPipe,
      ],
      providers: [
        NavigationService,
        UnsubscribeService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub }
      ]
    }).compileComponents();
    formPlayerService = TestBed.inject(FormPlayerService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormPlayerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
