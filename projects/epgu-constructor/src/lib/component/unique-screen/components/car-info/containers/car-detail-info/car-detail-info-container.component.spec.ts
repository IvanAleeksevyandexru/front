import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { ScreenPadModule, ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';

import { CarDetailInfoContainerComponent } from './car-detail-info-container.component';
import { CarDetailInfoService } from '../../service/car-detail-info.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { CarRegistrationComponent } from '../../components/car-registration/car-registration.component';
import { CarTechnicalDataComponent } from '../../components/car-technical-data/car-technical-data.component';
import { CarOwnerInfoComponent } from '../../components/car-owner-info/car-owner-info.component';
import { LegalComplianceComponent } from '../../components/legal-compliance/legal-compliance.component';
import { SearchPtsComponent } from '../../components/search-pts/search-pts.component';
import { NotaryInfoComponent } from '../../components/notary-info/notary-info.component';
import { CarOwnersComponent } from '../../components/car-owners/car-owners.component';
import { CarErrorComponent } from '../../components/car-error/car-error.component';
import { ErrorTemplatePipe } from '../../pipes/error-template.pipe';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ServiceResult } from '../../models/car-info.interface';
import { YesNoStrictPipe } from '../../pipes/yes-no-strict.pipe';

describe('CarDetailsInfoComponent', () => {
  let component: CarDetailInfoContainerComponent;
  let fixture: ComponentFixture<CarDetailInfoContainerComponent>;
  let carService: CarDetailInfoService;
  let screenService: ScreenService;
  const mockComponent = {
    id: 'carinfo2',
    type: 'CarDetailInfo',
    label: '',
    attrs: {
      tx: '46f4bfad-d6de-11ea-9135-fa163e1007b9',
      pdfLink: '/api/sp-adapter/pdf?orderId=763810595&pdfName=pdf&light=true',
      errors: {
        EXTERNAL_SERVER_ERROR:
          'Попробуйте снова или продолжите заполнять заявление без проверки транспортного средства <a data-retry=0>Повторить</a>',
        NOT_FOUND_ERROR: 'на учет <a data-action-type=\'prevStep\'>Попробовать снова</a>',
      },
      refs: {},
    },
    arguments: {
      vin: '100',
    },
    value: '',
    required: true,
  };
  const mockButtons = [
    {
      label: 'На главную',
      value: 'На главную',
      type: 'home',
      action: 'getNextScreen',
    },
    {
      label: 'Скачать pdf-файл',
      type: 'nextStep',
      action: 'getNextScreen',
    },
  ];

  const element = {
    dataset: {
      retry: true,
    },
  };
  const errorData = {
    data: {} as any,
    externalServiceCallResult: ServiceResult.EXTERNAL_SERVER_ERROR,
  };

  const successData = {
    data: {} as any,
    externalServiceCallResult: ServiceResult.SUCCESS,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CarDetailInfoContainerComponent,
        MockComponent(CarRegistrationComponent),
        MockComponent(CarTechnicalDataComponent),
        MockComponent(CarOwnerInfoComponent),
        MockComponent(LegalComplianceComponent),
        MockComponent(SearchPtsComponent),
        MockComponent(NotaryInfoComponent),
        MockComponent(CarOwnersComponent),
        MockComponent(CarErrorComponent),
        ErrorTemplatePipe,
        YesNoStrictPipe,
      ],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseModule),
        MockModule(ScreenPadModule),
        HttpClientTestingModule,
      ],
      providers: [
        CarDetailInfoService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
    screenService.buttons = mockButtons as any;
    carService = TestBed.inject(CarDetailInfoService);
    jest.spyOn(carService, 'fetchData');
    fixture = TestBed.createComponent(CarDetailInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('onClick', () => {
    it('should be call fetchData', () => {
      const spy = jest.spyOn(component.carInfoService, 'fetchData');
      component.carInfoService.vehicleInfo$.next(errorData);
      component.carInfoService.notaryInfo$.next(errorData);
      component.onClick(element as any);

      expect(spy).toHaveBeenCalled();
    });

    it('should be call fetchNotaryInfo', () => {
      const spy = jest.spyOn(component.carInfoService, 'fetchNotaryInfo');
      component.carInfoService.vehicleInfo$.next(successData);
      component.carInfoService.notaryInfo$.next(errorData);
      component.onClick(element as any);

      expect(spy).toHaveBeenCalled();
    });

    it('should be call fetchVehicleInfo', () => {
      const spy = jest.spyOn(component.carInfoService, 'fetchVehicleInfo');
      component.carInfoService.vehicleInfo$.next(errorData);
      component.carInfoService.notaryInfo$.next(successData);
      component.onClick(element as any);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('buttons$', () => {
    jest.useFakeTimers();

    it('should be return only buttons without nextStep type', () => {
      component.carInfoService.vehicleInfo$.next(errorData);
      component.buttons$.subscribe((buttons) => {
        expect(buttons).toEqual([mockButtons[0]]);
      });
      jest.runAllTimers();
    });

    it('should be return all buttons', () => {
      component.carInfoService.vehicleInfo$.next(successData);
      component.buttons$.subscribe((buttons) => {
        expect(buttons).toEqual(mockButtons);
      });
      jest.runAllTimers();
    });
  });
});
