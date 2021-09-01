import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import {
  ScreenPadModule,
  ConfigService,
  ConfigServiceStub,
  LocationService,
  LocationServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub, ObjectHelperService
} from '@epgu/epgu-constructor-ui-kit';

import { CarInfoContainerComponent } from './car-info-container.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { CarInfo, ServiceResult } from '../../models/car-info.interface';
import { CarInfoComponent } from '../../components/car-info/car-info.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { YesNoPipe } from '../../pipes/yes-no.pipe';
import { ErrorTemplatePipe } from '../../pipes/error-template.pipe';
import { EnginePowerPipe } from '../../pipes/engine-power.pipe';
import { ModelMarkNamePipe } from '../../pipes/model-mark-name.pipe';
import { CarDatePipe } from '../../pipes/car-date.pipe';
import { DefaultValuePipe } from '../../pipes/default-value.pipe';
import { EcologyClassPipe } from '../../pipes/ecology-class.pipe';
import { ExpansionLinkComponent } from '../../components/expansion-link/expansion-link.component';
import { CarOwnerInfoContainerComponent } from '../car-owner-info-screen/car-owner-info-container.component';
import { CarOwnerInfoComponent } from '../../components/car-owner-info/car-owner-info.component';
import { CarOwnersComponent } from '../../components/car-owners/car-owners.component';
import { LegalComplianceComponent } from '../../components/legal-compliance/legal-compliance.component';
import { NotaryInfoComponent } from '../../components/notary-info/notary-info.component';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { CarOwnerInfoLinkComponent } from '../../components/car-owner-info-link/car-owner-info-link.component';
import { YesNoStrictPipe } from '../../pipes/yes-no-strict.pipe';

describe('CarInfoContainerComponent', () => {
  let component: CarInfoContainerComponent;
  let fixture: ComponentFixture<CarInfoContainerComponent>;
  const mockData = {} as any;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [
        CarInfoComponent,
        CarInfoContainerComponent,
        CarOwnerInfoContainerComponent,
        CarOwnerInfoComponent,
        CarOwnerInfoLinkComponent,
        CarOwnersComponent,
        LegalComplianceComponent,
        NotaryInfoComponent,
        ExpansionLinkComponent,
        YesNoPipe,
        YesNoStrictPipe,
        ErrorTemplatePipe,
        EnginePowerPipe,
        ModelMarkNamePipe,
        CarDatePipe,
        DefaultValuePipe,
        EcologyClassPipe,
        YesNoStrictPipe,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        CurrentAnswersService,
        DownloadService,
        ObjectHelperService,
        NavigationService,
      ],
      imports: [
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ScreenPadModule),
        MockModule(DefaultUniqueScreenWrapperModule),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInfoContainerComponent);
    component = fixture.componentInstance;
    component.carInfo$ = of(mockData);
    fixture.detectChanges();
  });

  describe('mapCarInfoErrors()', () => {
    const errors = {
      EXTERNAL_SERVER_ERROR: 'external error text',
      NOT_FOUND_ERROR: 'not found error text',
    };

    it('should map external common error', () => {
      const res = component.mapCarInfoErrors(errors, {
        vehicleServiceCallResult: ServiceResult.EXTERNAL_SERVER_ERROR,
        notaryServiceCallResult: ServiceResult.EXTERNAL_SERVER_ERROR,
      } as CarInfo);

      expect(res).toEqual({
        externalCommon: {
          type: ServiceResult.EXTERNAL_SERVER_ERROR,
          text: 'external error text',
        },
      });
    });

    it('should map errors', () => {
      const res = component.mapCarInfoErrors(errors, {
        vehicleServiceCallResult: ServiceResult.SUCCESS,
        notaryServiceCallResult: ServiceResult.NOT_FOUND_ERROR,
      } as CarInfo);

      expect(res).toEqual({
        notary: {
          type: ServiceResult.NOT_FOUND_ERROR,
          text: 'not found error text',
        },
        vehicle: null,
      });
    });

    it('should map errors if there aren\'t values', () => {
      const res = component.mapCarInfoErrors(errors, {
        vehicleServiceCallResult: ServiceResult.SUCCESS,
        notaryServiceCallResult: ServiceResult.SUCCESS,
      } as CarInfo);

      expect(res).toEqual({
        notary: null,
        vehicle: null,
      });
    });
  });
});
