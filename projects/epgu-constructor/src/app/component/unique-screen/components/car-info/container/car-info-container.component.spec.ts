import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarInfoContainerComponent } from './car-info-container.component';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../../shared/components/screen-pad/screen-pad.module';
import { of } from 'rxjs';
import { CarInfoValues } from '../models/car-info.interface';
import { DisplayDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../../../screen/screen.types';
import { CarInfoComponent } from '../components/car-info-screen/car-info.component';
import { CarInfoLegalPipe } from '../pipes/car-info.pipe';
import { CarInfoStatusPipe } from '../pipes/car-status.pipe';
import { CarInfoDatePipe } from '../pipes/car-date-format.pipe';
import { CarInfoOwnerPipe } from '../pipes/car-owner-type.pipe';
import { CarInfoAccidentsPipe } from '../pipes/car-accidents.pipe';
import { ScreenService } from '../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { LocationService } from '../../../../../core/services/location/location.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../shared/directives/action/action.service.stub';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { DeviceDetectorService } from '../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../core/services/device-detector/device-detector.service.stub';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { LocationServiceStub } from '../../../../../core/services/location/location.service.stub';



describe('CarInfoContainerComponent', () => {
  let component: CarInfoContainerComponent;
  let fixture: ComponentFixture<CarInfoContainerComponent>;
  const mockData: CarInfoValues = {
    brandModel: 'test',
    status: 'REGISTERED',
    owners: [],
    legals: [],
    accidenceCount: 3,
  };
  const mockDisplay: DisplayDto = {
    components: [],
    subHeader: { text: '', clarifications: {}},
    header: '',
    label: '',
    id: '',
    name: '',
    displayCssClass: '',
    submitLabel: '',
    terminal: false,
    type: ScreenTypes.UNIQUE,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CarInfoContainerComponent,
        CarInfoComponent,
        CarInfoLegalPipe,
        CarInfoStatusPipe,
        CarInfoDatePipe,
        CarInfoOwnerPipe,
        CarInfoAccidentsPipe
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
    fixture = TestBed.createComponent(CarInfoContainerComponent);
    component = fixture.componentInstance;
    component.showNav$ = of(true);
    component.isLoading$ = of(true);
    component.display$ = of(mockDisplay);
    component.carInfo$ = of(mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
