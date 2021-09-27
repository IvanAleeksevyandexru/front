import { TimeSlotDoctorsContainerComponent } from './time-slot-doctors-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { ScreenButtonsModule } from '../../../../../shared/components/screen-buttons/screen-buttons.module';
import { TimeSlotDoctorsComponent } from '../time-slot-doctors.component';
import { TimeSlotDoctorService } from '../time-slot-doctor.service';
import {
  ConfigService,
  ConfigServiceStub,
  ConstructorCheckboxModule,
  ConstructorLookupModule,
  DatesToolsService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  DownloadService,
  EventBusService,
  HttpCancelService,
  LocalStorageService,
  LocalStorageServiceStub,
  LocationService,
  LocationServiceStub,
  LoggerService,
  LoggerServiceStub,
  ModalService,
  ModalServiceStub,
  ScreenContainerModule,
  ScreenPadModule,
  SessionStorageService,
  SessionStorageServiceStub,
  TimeCalendarModule,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { Smev3TimeSlotsRestService } from '../../time-slots/smev3-time-slots-rest.service';
import { Smev3TimeSlotsRestServiceStub } from '../../time-slots/stubs/smev3-time-slots-rest.service.stub';
import { JsonHelperService } from '../../../../../core/services/json-helper/json-helper.service';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { MockProvider } from 'ng-mocks';
import { TimeSlotsConstants } from '../../time-slots/time-slots.constants';
import { FormPlayerApiService } from '../../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { NavigationService } from '../../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../../core/services/navigation/navigation.service.stub';
import { NavigationModalService } from '../../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { HtmlRemoverService } from '../../../../../shared/services/html-remover/html-remover.service';
import { AutocompleteApiService } from '../../../../../core/services/autocomplete/autocomplete-api.service';
import { FormPlayerService } from '../../../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../../../form-player/services/form-player/form-player.service.stub';
import { CustomListGenericData } from '../../../../custom-screen/components-list.types';
import { DictionaryResponse } from '../../../../../shared/services/dictionary/dictionary-api.types';
import { DisclaimerModule } from '../../../../../shared/components/disclaimer/disclaimer.module';
import { HttpClientModule } from '@angular/common/http';

describe('TimeSlotDoctorsContainerComponent', () => {
  let component: TimeSlotDoctorsContainerComponent;
  let fixture: ComponentFixture<TimeSlotDoctorsContainerComponent>;

  const mockLkApiItems = {
    totalItems: 6,
    items: [
      {
        parentItem: null,
        children: [],
        fields: {
          itemName: null,
          title: null,
        },
        attributes: [
          {
            name: 'Service_Id',
            value: '109',
          },
          {
            name: 'Service_Name',
            value: 'врач-терапевт',
          },
        ],
      },
      {
        parentItem: null,
        children: [],
        fields: {
          itemName: null,
          title: null,
        },
        attributes: [
          {
            name: 'Service_Id',
            value: '122',
          },
          {
            name: 'Service_Name',
            value: 'врач-хирург',
          },
        ],
      },
    ],
    version: null,
    error: {
      errorDetail: {
        errorCode: 0,
        errorMessage: 'Operation completed',
      },
      fieldErrors: [],
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotDoctorsContainerComponent, TimeSlotDoctorsComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: Smev3TimeSlotsRestService, useClass: Smev3TimeSlotsRestServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: SessionStorageService, useClass: SessionStorageServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        MockProvider(ComponentsListRelationsService),
        TimeSlotDoctorService,
        CurrentAnswersService,
        DatesToolsService,
        JsonHelperService,
        DictionaryToolsService,
        AutocompleteApiService,
        TimeSlotsConstants,
        UnsubscribeService,
        HttpCancelService,
        DownloadService,
        HtmlRemoverService,
        EventBusService,
      ],
      imports: [
        BaseModule,
        BaseComponentsModule,
        ScreenContainerModule,
        ScreenPadModule,
        ConstructorLookupModule,
        ScreenButtonsModule,
        DefaultUniqueScreenWrapperModule,
        TimeCalendarModule,
        ConstructorCheckboxModule,
        DisclaimerModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotDoctorsContainerComponent);
    component = fixture.componentInstance;
    jest.spyOn(component, 'ngAfterViewInit').mockReturnValue(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('chooseTimeSlot should format string', () => {
    const slot = {
      slotId: 'cc2889ce-6fb4-4d16-ac9e-86d3a4eb3b7a',
      areaId: '2',
      slotTime: new Date('2021-09-29T08:00:00.000'),
      timezone: '+03:00',
    };
    component.chooseTimeSlot(slot);
    expect(component.selectedTimeStr).toEqual('29 сентября 2021 года в 08:00, среда');
  });

  describe('filterByAttributeName()', () => {
    it('should return all items after filtration without search string', () => {
      const filteredItems = component.filterByAttributeName(
        ({ data: { items: mockLkApiItems.items }} as unknown) as CustomListGenericData<
          DictionaryResponse
        >,
        'Service_Name',
        '',
      );

      expect(filteredItems).toEqual(mockLkApiItems.items);
    });

    it('should return filtered items after filtration with search string', () => {
      const filteredItems = component.filterByAttributeName(
        ({ data: { items: mockLkApiItems.items }} as unknown) as CustomListGenericData<
          DictionaryResponse
        >,
        'Service_Name',
        'врач-тер',
      );

      expect(filteredItems).toEqual([mockLkApiItems.items[0]]);
    });

    it('should return filtered items after filtration with search string. Case insensitive check', () => {
      const filteredItems = component.filterByAttributeName(
        ({ data: { items: mockLkApiItems.items }} as unknown) as CustomListGenericData<
          DictionaryResponse
        >,
        'Service_Name',
        'ВрАЧ',
      );

      expect(filteredItems).toEqual(mockLkApiItems.items);
    });

    it('should return empty array if there is no attribute name', () => {
      const filteredItems = component.filterByAttributeName(
        ({ data: { items: mockLkApiItems.items }} as unknown) as CustomListGenericData<
          DictionaryResponse
        >,
        null,
        'ВрАЧ',
      );

      expect(filteredItems).toEqual([]);
    });
  });
});
