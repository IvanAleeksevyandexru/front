import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { UniqueScreenComponent } from './unique-screen.component';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ScreenServiceStub } from '../screen.service.stub';
import { MockComponents } from 'ng-mocks';
import { UnusedPaymentsComponent } from '../../component/unique-screen/components/unused-payments/unused-payments.component';
import { SelectMapObjectComponent } from '../../component/unique-screen/components/select-map-object/select-map-object.component';
import { FileUploadScreenComponent } from '../../component/unique-screen/components/file-upload-screen/file-upload-screen.component';
import { EmployeeHistoryComponent } from '../../component/unique-screen/components/employee-history/employee-history.component';
import { RepeatableFieldsComponent } from '../../component/unique-screen/components/repeatable-fields/repeatable-fields.component';
import { TimeSlotsComponent } from '../../component/unique-screen/components/time-slots/time-slots.component';
import { CarInfoComponent } from '../../component/unique-screen/components/car-info/components/car-info-screen/car-info.component';
// eslint-disable-next-line max-len
import { SignatureApplicationComponent } from '../../component/unique-screen/components/signature-application/components/signature-application.component';
import { PaymentComponent } from '../../component/unique-screen/components/payment/components/payment/payment.component';
import { BillInfoComponent } from '../../component/unique-screen/components/payment/components/billinfo/billinfo.component';
// eslint-disable-next-line max-len
import { UploadAndEditPhotoComponent } from '../../component/unique-screen/components/upload-and-edit-photo/upload-and-edit-photo.component';
// eslint-disable-next-line max-len
import { PaymentTypeSelectorComponent } from '../../component/unique-screen/components/payment-type-selector/payment-type-selector.component';
import { UniqueScreenComponentTypes } from '../../component/unique-screen/unique-screen-components.types';
import {
  ApplicantAnswersDto,
  ComponentDto,
  DisplayDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { NavigationPayload } from '../../form-player/form-player.types';
import { By } from '@angular/platform-browser';
import { ScreenTypes } from '../screen.types';
import { Gender } from '../../shared/types/gender';

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

const displayDtoSample: DisplayDto = {
  components: [],
  header: 'header1',
  id: 'id1',
  name: 'name1',
  submitLabel: 'submitLabel1',
  type: ScreenTypes.CUSTOM,
  terminal: true,
};

const applicantAnswersDtoSample: ApplicantAnswersDto = {
  foo: {
    visited: true,
    value: 'bar',
  },
};

describe('UniqueScreenComponent', () => {
  let component: UniqueScreenComponent;
  let fixture: ComponentFixture<UniqueScreenComponent>;

  let navigationService: NavigationServiceStub;
  let screenService: ScreenServiceStub;

  const initComponent = () => {
    fixture = TestBed.createComponent(UniqueScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UniqueScreenComponent,
        MockComponents(
          UnusedPaymentsComponent,
          SelectMapObjectComponent,
          FileUploadScreenComponent,
          EmployeeHistoryComponent,
          RepeatableFieldsComponent,
          TimeSlotsComponent,
          CarInfoComponent,
          SignatureApplicationComponent,
          PaymentComponent,
          BillInfoComponent,
          UploadAndEditPhotoComponent,
          PaymentTypeSelectorComponent,
        ),
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    initComponent();

    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('uniqueComponentName property', () => {
    it('should be UniqueScreenComponentTypes', () => {
      expect(component.uniqueComponentName).toBe(UniqueScreenComponentTypes);
    });
  });

  describe('nextDataForStep() method', () => {
    it('should call nextStep() method with payload object', () => {
      const nextStepSpy = spyOn(component, 'nextStep');

      screenService.component = componentDtoSample;

      component.nextDataForStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        [componentDtoSample.id]: {
          visited: true,
          value: undefined,
        },
      });
      nextStepSpy.calls.reset();

      component.nextDataForStep('some value');

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        [componentDtoSample.id]: {
          visited: true,
          value: 'some value',
        },
      });
      nextStepSpy.calls.reset();
    });
  });

  describe('nextStep() method', () => {
    it('should call navigationService.nextStep.next()', () => {
      const nextStepSpy = spyOn(navigationService, 'next');

      component.nextStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: undefined,
      });
      nextStepSpy.calls.reset();

      const navigationPayload: NavigationPayload = {
        foo: {
          visited: true,
          value: 'bar',
        },
      };

      component.nextStep(navigationPayload);
      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: navigationPayload,
      });
    });
  });

  describe('epgu-constructor-unused-payments', () => {
    const selector = 'epgu-constructor-unused-payments';

    it('should be rendered if componentType is unusedPayments', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.unusedPayments;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('data property should be equal to screenService.display', () => {
      screenService.componentType = UniqueScreenComponentTypes.unusedPayments;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.display = displayDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(displayDtoSample);
    });

    it('should call nextDataForStep() on epgu-constructor-unused-payments nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.unusedPayments;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-select-map-object', () => {
    const selector = 'epgu-constructor-select-map-object';

    it('should be rendered if componentType is mapService', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.mapService;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('data property should be equal to screenService.component', () => {
      screenService.componentType = UniqueScreenComponentTypes.mapService;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.component = componentDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    });

    it('applicantAnswers property should be equal to screenService.applicantAnswers', () => {
      screenService.componentType = UniqueScreenComponentTypes.mapService;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.applicantAnswers).toBeNull();

      screenService.applicantAnswers = applicantAnswersDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.applicantAnswers).toBe(applicantAnswersDtoSample);
    });

    it('should call nextDataForStep() on epgu-constructor-select-map-object nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.mapService;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-file-upload-screen', () => {
    const selector = 'epgu-constructor-file-upload-screen';

    it('should be rendered if componentType is mapService', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('isLoading property should be equal to screenService.isLoading', () => {
      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.isLoading).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.isLoading).toBeTruthy();
    });

    it('applicantAnswers property should be equal to screenService.applicantAnswers', () => {
      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.applicantAnswers).toBeNull();

      screenService.applicantAnswers = applicantAnswersDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.applicantAnswers).toBe(applicantAnswersDtoSample);
    });

    it('header property should be equal to screenService.header', () => {
      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.header).toBeNull();

      screenService.header = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.header).toBe('any');
    });

    it('submitLabel property should be equal to screenService.submitLabel', () => {
      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.submitLabel).toBeNull();

      screenService.submitLabel = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.submitLabel).toBe('any');
    });

    it('data property should be equal to screenService.component', () => {
      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.component = componentDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    });

    it('should call nextDataForStep() on epgu-constructor-file-upload-screen nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.fileUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-employee-history', () => {
    const selector = 'epgu-constructor-employee-history';

    it('should be rendered if componentType is employeeHistory', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.employeeHistory;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('header property should be equal to screenService.header', () => {
      screenService.componentType = UniqueScreenComponentTypes.employeeHistory;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.header).toBeNull();

      screenService.header = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.header).toBe('any');
    });

    it('gender property should be equal to screenService.gender', () => {
      screenService.componentType = UniqueScreenComponentTypes.employeeHistory;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.gender).toBeNull();

      screenService.gender = Gender.male;
      fixture.detectChanges();

      expect(debugEl.componentInstance.gender).toBe(Gender.male);
    });

    it('display property should be equal to screenService.display', () => {
      screenService.componentType = UniqueScreenComponentTypes.employeeHistory;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.display).toBeNull();

      screenService.display = displayDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.display).toBe(displayDtoSample);
    });

    it('should call nextDataForStep() on epgu-constructor-employee-history nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.employeeHistory;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-repeatable-fields', () => {
    const selector = 'epgu-constructor-repeatable-fields';

    it('should be rendered if componentType is repeatableFields', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.repeatableFields;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('data property should be equal to screenService.display', () => {
      screenService.componentType = UniqueScreenComponentTypes.repeatableFields;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.display = displayDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(displayDtoSample);
    });

    it('should call nextDataForStep() on epgu-constructor-repeatable-fields nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.repeatableFields;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-time-slots', () => {
    const selector = 'epgu-constructor-time-slots';

    it('should be rendered if componentType is timeSlot', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.timeSlot;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('data property should be equal to screenService.display', () => {
      screenService.componentType = UniqueScreenComponentTypes.timeSlot;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.display = displayDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(displayDtoSample);
    });

    it('isLoading property should be equal to screenService.isLoading', () => {
      screenService.componentType = UniqueScreenComponentTypes.timeSlot;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.isLoading).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.isLoading).toBeTruthy();
    });

    it('should call nextDataForStep() on epgu-constructor-time-slots nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.timeSlot;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-car-info', () => {
    const selector = 'epgu-constructor-car-info';

    it('should be rendered if componentType is carInfo', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.carInfo;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('display property should be equal to screenService.display', () => {
      screenService.componentType = UniqueScreenComponentTypes.carInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.display).toBeNull();

      screenService.display = displayDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.display).toBe(displayDtoSample);
    });

    it('isLoading property should be equal to screenService.isLoading', () => {
      screenService.componentType = UniqueScreenComponentTypes.carInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.isLoading).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.isLoading).toBeTruthy();
    });

    it('should call nextDataForStep() on epgu-constructor-car-info nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.carInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-signature-application', () => {
    const selector = 'epgu-constructor-signature-application';

    it('should be rendered if componentType is signatureApplication', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.signatureApplication;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should call nextDataForStep() on epgu-constructor-signature-application nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.signatureApplication;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-payment', () => {
    const selector = 'epgu-constructor-payment';

    it('should be rendered if componentType is paymentScr', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.paymentScr;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('header property should be equal to screenService.header', () => {
      screenService.componentType = UniqueScreenComponentTypes.paymentScr;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.header).toBeNull();

      screenService.header = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.header).toBe('any');
    });

    it('data property should be equal to screenService.component', () => {
      screenService.componentType = UniqueScreenComponentTypes.paymentScr;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.component = componentDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    });

    it('submitLabel property should be equal to screenService.submitLabel', () => {
      screenService.componentType = UniqueScreenComponentTypes.paymentScr;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.submitLabel).toBeNull();

      screenService.submitLabel = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.submitLabel).toBe('any');
    });

    it('should call nextDataForStep() on epgu-constructor-payment nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.paymentScr;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith(); // ignore argument from nextStepEvent()
    });
  });

  describe('epgu-constructor-bill-info', () => {
    const selector = 'epgu-constructor-bill-info';

    it('should be rendered if componentType is billInfo', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.billInfo;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('header property should be equal to screenService.header', () => {
      screenService.componentType = UniqueScreenComponentTypes.billInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.header).toBeNull();

      screenService.header = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.header).toBe('any');
    });

    it('data property should be equal to screenService.component', () => {
      screenService.componentType = UniqueScreenComponentTypes.billInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.data).toBeNull();

      screenService.component = componentDtoSample;
      fixture.detectChanges();

      expect(debugEl.componentInstance.data).toBe(componentDtoSample);
    });

    it('submitLabel property should be equal to screenService.submitLabel', () => {
      screenService.componentType = UniqueScreenComponentTypes.billInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.submitLabel).toBeNull();

      screenService.submitLabel = 'any';
      fixture.detectChanges();

      expect(debugEl.componentInstance.submitLabel).toBe('any');
    });

    it('should call nextDataForStep() on epgu-constructor-bill-info nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.billInfo;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith(); // ignore argument from nextStepEvent()
    });
  });

  describe('epgu-constructor-upload-and-edit-photo', () => {
    const selector = 'epgu-constructor-upload-and-edit-photo';

    it('should be rendered if componentType is photoUploadComponent', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.photoUploadComponent;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should call nextDataForStep() on epgu-constructor-upload-and-edit-photo nextStepEvent() event', () => {
      screenService.componentType = UniqueScreenComponentTypes.photoUploadComponent;
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      const nextDataForStepSpy = spyOn(component, 'nextDataForStep');

      debugEl.triggerEventHandler('nextStepEvent', 'any');

      expect(nextDataForStepSpy).toBeCalledTimes(1);
      expect(nextDataForStepSpy).toBeCalledWith('any');
    });
  });

  describe('epgu-constructor-payment-type-selector', () => {
    const selector = 'epgu-constructor-payment-type-selector';

    it('should be rendered if componentType is paymentTypeSelector', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.componentType = UniqueScreenComponentTypes.paymentTypeSelector;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });
  });
});
