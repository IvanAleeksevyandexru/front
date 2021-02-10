import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInfoComponent } from './car-info.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CarInfoContainerComponent } from '../../containers/car-info-screen/car-info-container.component';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../../core/services/device-detector/device-detector.service.stub';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { LocationServiceStub } from '../../../../../../core/services/location/location.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { CarInfo } from '../../models/car-info.interface';
import { YesNoPipe } from '../../pipes/yes-no.pipe';
import { ErrorTemplatePipe } from '../../pipes/error-template.pipe';
import { EnginePowerPipe } from '../../pipes/engine-power.pipe';
import { ModelMarkNamePipe } from '../../pipes/model-mark-name.pipe';
import { CarDatePipe } from '../../pipes/car-date.pipe';
import { DefaultValuePipe } from '../../pipes/default-value.pipe';
import { ExpansionLinkComponent } from '../expansion-link/expansion-link.component';


describe('CarInfoComponent', () => {
  let component: CarInfoComponent;
  let fixture: ComponentFixture<CarInfoComponent>;
  const mockData: CarInfo = {
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CarInfoContainerComponent,
        CarInfoComponent,
        YesNoPipe,
        ErrorTemplatePipe,
        EnginePowerPipe,
        ModelMarkNamePipe,
        CarDatePipe,
        DefaultValuePipe,
        ExpansionLinkComponent
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        CurrentAnswersService, UtilsService, NavigationService,
      ],
      imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInfoComponent);
    component = fixture.componentInstance;
    component.carInfo = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
