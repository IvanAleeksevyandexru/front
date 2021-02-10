import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { of } from 'rxjs';
import { DisplayDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenTypes } from '../../../../../../screen/screen.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { DeviceDetectorService } from '../../../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../../../core/services/device-detector/device-detector.service.stub';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { LocationServiceStub } from '../../../../../../core/services/location/location.service.stub';
import { CarListContainerComponent } from './car-list-container.component';
import { CarListComponent } from '../car-list/car-list.component';
import { ConstructorLookupModule } from '../../../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { ServiceResult } from '../../../car-info/models/car-info.interface';
import { CarList } from '../../models/car-list.interface';


describe('CarInfoContainerComponent', () => {
  let component: CarListContainerComponent;
  let fixture: ComponentFixture<CarListContainerComponent>;
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

  const mockCarList = {
    vehicles: [
      {
        markName: 'Киа',
        modelName: 'Рио',
        modelMarkName: 'Киа Рио',
        govRegNumber: 'А 777 АА',
      },
      {
        markName: 'Мазда',
        modelName: 'CX5',
        govRegNumber: 'M 005 CX',
      }
    ],
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CarListContainerComponent,
        CarListComponent
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        CurrentAnswersService, UtilsService, NavigationService,
      ],
      imports: [BaseModule, BaseComponentsModule, ScreenContainerModule, ScreenPadModule, ConstructorLookupModule],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarListContainerComponent);
    component = fixture.componentInstance;
    component.showNav$ = of(true);
    component.isLoading$ = of(true);
    component.display$ = of(mockDisplay);
    component.component$ = of({ value: JSON.stringify(mockCarList) } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('search()', () => {
    it('should return filtered items by reg number', () => {
      const search$ = component.lookupProvider.search;
      search$.call('M 005 CX').subscribe(res =>
        expect(res).toEqual([mockCarList[1]])
      );
    });

    it('should return filtered items by mark', () => {
      const search$ = component.lookupProvider.search;
      search$.call('Киа Рио').subscribe(res =>
        expect(res).toEqual([mockCarList[0]])
      );
    });

    it('should return []', () => {
      const search$ = component.lookupProvider.search;
      search$.call('S 222 ST').subscribe(res =>
        expect(res).toEqual([mockCarList[0]])
      );
    });
  });

  describe('handleErrors()', () => {
    it('should define hasError and errorTemplate after call', () => {
      const carList = { vehicleServiceCallResult: ServiceResult.NOT_FOUND_ERROR } as CarList;
      const attrs = { errors: {
          NOT_FOUND_ERROR: {} as any
      }};
      component.handleErrors(carList, attrs);

      expect(component.hasError).toEqual(true);
      expect(component.errorTemplate).toEqual({});
    });

    it('should define only hasError after call if there is no error', () => {
      const carList = { vehicleServiceCallResult: ServiceResult.SUCCESS } as CarList;
      component.handleErrors(carList, {} as any);
      expect(component.hasError).toEqual(false);
      expect(component.errorTemplate).toEqual(undefined);
    });
  });


});