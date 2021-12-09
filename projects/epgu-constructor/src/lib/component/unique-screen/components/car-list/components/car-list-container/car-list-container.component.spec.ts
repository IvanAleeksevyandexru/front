import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ScreenTypes, DisplayDto } from '@epgu/epgu-constructor-types';
import {
  ScreenPadModule,
  ConfigService,
  LocationService,
  LocationServiceStub,
  ConstructorLookupModule,
  ConfigServiceStub,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ModalService,
  ModalServiceStub,
  WINDOW_PROVIDERS,
  HttpCancelService,
  PrevButtonModule,
  PREV_BUTTON_NAVIGATION,
  ObjectHelperService,
  LocalStorageService,
  LocalStorageServiceStub,
  JsonHelperService,
  JsonHelperServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { NavigationService } from '../../../../../../core/services/navigation/navigation.service';
import { CarListContainerComponent } from './car-list-container.component';
import { CarListComponent } from '../car-list/car-list.component';
import { ServiceResult } from '../../../car-info/models/car-info.interface';
import { CarList } from '../../models/car-list.interface';
import { ScreenButtonsModule } from '../../../../../../shared/components/screen-buttons/screen-buttons.module';
import { MockModule } from 'ng-mocks';
import { PrevButtonNavigationService } from '../../../../../../core/services/prev-button-navigation/prev-button-navigation.service';
import { CachedAnswersService } from '../../../../../../shared/services/cached-answers/cached-answers.service';

describe('CarListContainerComponent', () => {
  let component: CarListContainerComponent;
  let screenService: ScreenService;
  let cachedAnswersService: CachedAnswersService;
  let fixture: ComponentFixture<CarListContainerComponent>;
  const mockDisplay: DisplayDto = {
    components: [],
    subHeader: { text: '', clarifications: {}},
    header: '',
    label: '',
    id: '',
    name: '',
    displayCssClass: '',
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
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarListContainerComponent, CarListComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: PREV_BUTTON_NAVIGATION, useClass: PrevButtonNavigationService },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        CachedAnswersService,
        CurrentAnswersService,
        DownloadService,
        ObjectHelperService,
        NavigationService,
        ModalService,
        HttpCancelService,
        WINDOW_PROVIDERS,
      ],
      imports: [
        BaseModule,
        BaseComponentsModule,
        ScreenContainerModule,
        ScreenPadModule,
        ConstructorLookupModule,
        ScreenButtonsModule,
        MockModule(PrevButtonModule),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarListContainerComponent);
    cachedAnswersService = TestBed.inject(CachedAnswersService);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    screenService.buttons = [];
    component.showNav$ = of(true);
    component.isLoading$ = of(true);
    component.display$ = of(mockDisplay);
    component.component$ = of({ value: JSON.stringify(mockCarList) } as any);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getInitialItem()', () => {
    it('should return undefined if there is no data to set', () => {
      jest.spyOn(cachedAnswersService, 'getCachedValueById').mockReturnValueOnce('{}');
      component.carFixedItems = null;

      component.getInitialItem('', {});

      expect(component.getInitialItem('', {})).toEqual(undefined);
    });

    it('should return cached value if there is data to set', () => {
      jest.spyOn(cachedAnswersService, 'getCachedValueById').mockReturnValueOnce(JSON.stringify({
        vehicleInfo: {
          govRegNumber: 'M 005 CX'
        }
      }));
      component.carFixedItems = component.getCarFixedItems(mockCarList as unknown as CarList);

      expect(component.getInitialItem('', {})).toEqual(component.carFixedItems[1]);
    });

    it('should return first item as initial item', () => {
      jest.spyOn(cachedAnswersService, 'getCachedValueById').mockReturnValueOnce('{}');
      component.carFixedItems = component.getCarFixedItems(mockCarList as unknown as CarList);

      component.getInitialItem('', {});

      expect(component.getInitialItem('', {})).toEqual(component.carFixedItems[0]);
    });
  });

  describe('handleErrors()', () => {
    it('should define hasError and not found errorTemplate after call', () => {
      const carList = { vehicleServiceCallResult: ServiceResult.NOT_FOUND_ERROR } as CarList;
      const attrs = {
        errors: {
          NOT_FOUND_ERROR: {} as any,
        },
      };
      component.handleErrors(carList, attrs);

      expect(component.hasError).toEqual(true);
      expect(component.errorTemplate).toEqual({});
    });

    it('should define hasError and external errorTemplate after call', () => {
      const carList = { vehicleServiceCallResult: ServiceResult.EXTERNAL_SERVER_ERROR } as CarList;
      const attrs = {
        errors: {
          EXTERNAL_SERVER_ERROR: {} as any,
        },
      };
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

  describe('getHtmlItemTemplate()', () => {
    it('should return html iem template', () => {
      expect(component.getHtmlItemTemplate(mockCarList.vehicles[0] as any)).toEqual(
        'Киа Рио, <span style="white-space: nowrap">А 777 АА</span>',
      );
    });
  });

  describe('getCarFixedItems()', () => {
    it('should return fixed items', () => {
      expect(component.getCarFixedItems(mockCarList as any)[0].originalItem).toEqual(
        mockCarList.vehicles[0],
      );
    });
  });

  describe('getModelMarkName()', () => {
    it('should return model mark name', () => {
      expect(component.getModelMarkName(mockCarList.vehicles[0] as any)).toEqual('Киа Рио');
    });

    it('should return empty string if there are no values', () => {
      expect(component.getModelMarkName({} as any)).toEqual('');
    });
  });
});
