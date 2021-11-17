import {
  SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE,
  TimeSlotDoctorsContainerComponent,
} from './time-slot-doctors-container.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import {
  SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT,
  TimeSlotsConstants,
} from '../../time-slots/time-slots.constants';
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
import { TimeSlotDoctorsComponentDto, TimeSlotDoctorState } from '../time-slot-doctors.interface';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  COMMON_ERROR_MODAL_PARAMS,
  ITEMS_FAILURE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
} from '../../../../../core/services/error-handler/error-handler';
import {
  ComponentDto,
  ConfirmationModal,
  ScreenButton,
  SlotsNotFoundTemplate,
} from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';
import { HtmlSelectService } from '../../../../../core/services/html-select/html-select.service';
import {
  SmevBookResponseInterface,
  TimeSlotsAnswerInterface,
} from '../../time-slots/time-slots.types';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { ListItem } from '@epgu/ui/models/dropdown';

describe('TimeSlotDoctorsContainerComponent', () => {
  let component: TimeSlotDoctorsContainerComponent;
  let fixture: ComponentFixture<TimeSlotDoctorsContainerComponent>;
  let currentAnswersService: CurrentAnswersService;
  let modalService: ModalService;
  let timeSlotDoctorService: TimeSlotDoctorService;
  let screenService: ScreenService;
  let actionService: ActionService;
  let httpCancelService: HttpCancelService;
  let datesHelperService: DatesToolsService;

  const mockComponent = {
    id: 'ts_doctor_ref',
    type: 'TimeSlotDoctor',
    label: '',
    attrs: {
      isOnlyDocLookupNeeded: true,
      docLookup: {
        label: 'Врач',
        dictionaryType: 'v1/equeue/agg/ref/items',
        dictionaryUrlType: 'lkApi',
        mappingParams: {
          idPath: 'attributes[5].value',
          textPath: 'attributes[6].value',
        },
        searchProvider: {
          turnOffStartFilter: true,
          filterByAttributeName: 'Resource_Name',
          dictionaryFilter: [
            {
              attributeName: 'Service_Id',
              condition: 'EQUALS',
              value: 'MedRef.value.convertedAttributes.toSpecsId',
              valueType: 'ref',
              excludeWrapper: true,
            },
            {
              attributeName: 'Referral_Id',
              condition: 'EQUALS',
              value: 'MedRef.value.convertedAttributes.referralId',
              valueType: 'ref',
              excludeWrapper: true,
            },
            {
              attributeName: 'MO_OID',
              condition: 'EQUALS',
              value: 'MedRef.value.convertedAttributes.toMoOid',
              valueType: 'ref',
              excludeWrapper: true,
            },
            {
              attributeName: 'Session_Id',
              condition: 'EQUALS',
              value: 'reg1.value.medicalInfo.sessionId',
              valueType: 'ref',
              excludeWrapper: true,
            },
          ],
          dictionaryOptions: {
            selectAttributes: ['Resource_Id', 'Resource_Name'],
            additionalParams: [
              {
                name: 'eserviceId',
                value: 'reg1.value.medicalInfo.eserviceId',
                type: 'ref',
              },
              {
                name: 'refName',
                value: 'Resource',
                type: 'value',
              },
            ],
            excludedParams: ['parentRefItemValue', 'tx'],
          },
        },
        ref: [],
        required: true,
        validation: [
          {
            type: 'RegExp',
            value: '.+',
            errorMsg: 'Поле не может быть пустым',
          },
        ],
      },
      specLookup: {
        label: 'Врач',
        dictionaryType: 'v1/equeue/agg/ref/items',
        dictionaryUrlType: 'lkApi',
        mappingParams: {
          idPath: 'attributes[5].value',
          textPath: 'attributes[6].value',
        },
        searchProvider: {
          turnOffStartFilter: true,
          filterByAttributeName: 'Resource_Name',
          dictionaryFilter: [
            {
              attributeName: 'Service_Id',
              condition: 'EQUALS',
              value: 'MedRef.value.convertedAttributes.toSpecsId',
              valueType: 'ref',
              excludeWrapper: true,
            },
            {
              attributeName: 'Referral_Id',
              condition: 'EQUALS',
              value: 'MedRef.value.convertedAttributes.referralId',
              valueType: 'ref',
              excludeWrapper: true,
            },
            {
              attributeName: 'MO_OID',
              condition: 'EQUALS',
              value: 'MedRef.value.convertedAttributes.toMoOid',
              valueType: 'ref',
              excludeWrapper: true,
            },
            {
              attributeName: 'Session_Id',
              condition: 'EQUALS',
              value: 'reg1.value.medicalInfo.sessionId',
              valueType: 'ref',
              excludeWrapper: true,
            },
          ],
          dictionaryOptions: {
            selectAttributes: ['Resource_Id', 'Resource_Name'],
            additionalParams: [
              {
                name: 'eserviceId',
                value: 'reg1.value.medicalInfo.eserviceId',
                type: 'ref',
              },
              {
                name: 'refName',
                value: 'Resource',
                type: 'value',
              },
            ],
            excludedParams: ['parentRefItemValue', 'tx'],
          },
        },
        ref: [],
        required: true,
        validation: [
          {
            type: 'RegExp',
            value: '.+',
            errorMsg: 'Поле не может быть пустым',
          },
        ],
      },
      ts: {
        restrictions: { minDate: [30, 'd'], maxDate: [1, 'y'] },
        attributeNameWithAddress: 'Address_MO',
        daysToShow: 15,
        startSection: 'today',
        isMonthsRangeVisible: true,
        timeSlotType: {
          type: 'CONST',
          value: 'DOCTOR',
        },
      },
    },
    arguments: {
      vin: '100',
    },
    value:
      // eslint-disable-next-line max-len
      '{"orderId":764189425,"eserviceId":"10000104378","serviceId":"-10000006633","serviceCode":"-10000006633","department":"{\\"value\\":\\"987\\",\\"parentValue\\":null,\\"title\\":\\"Поликлиника 7\\",\\"isLeaf\\":true,\\"children\\":null,\\"attributes\\":[{\\"name\\":\\"MO_Oid\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"1.2.643.5.1.13.13.12.2.15.1058.0.103000\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.15.1058.0.103000\\"},\\"valueAsOfType\\":\\"1.2.643.5.1.13.13.12.2.15.1058.0.103000\\"},{\\"name\\":\\"Address_MO\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"Республика Северная Осетия - Алания, г Владикавказ, ул Весенняя, д 14\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"Республика Северная Осетия - Алания, г Владикавказ, ул Весенняя, д 14\\"},\\"valueAsOfType\\":\\"Республика Северная Осетия - Алания, г Владикавказ, ул Весенняя, д 14\\"},{\\"name\\":\\"Reg_Phone\\",\\"type\\":\\"STRING\\",\\"value\\":{\\"asString\\":\\"(867) 550-80-91\\",\\"asLong\\":null,\\"asDecimal\\":null,\\"asDateTime\\":null,\\"asDate\\":null,\\"asBoolean\\":null,\\"typeOfValue\\":\\"STRING\\",\\"value\\":\\"(867) 550-80-91\\"},\\"valueAsOfType\\":\\"(867) 550-80-91\\"}],\\"source\\":null,\\"attributeValues\\":{\\"Address_MO\\":\\"Республика Северная Осетия - Алания, г Владикавказ, ул Весенняя, д 14\\",\\"MO_Oid\\":\\"1.2.643.5.1.13.13.12.2.15.1058.0.103000\\",\\"Reg_Phone\\":\\"(867) 550-80-91\\"},\\"objectId\\":3,\\"center\\":[44.633343,43.040624],\\"baloonContent\\":[{\\"value\\":\\"Республика Северная Осетия - Алания, г Владикавказ, ул Весенняя, д 14\\",\\"label\\":\\"Адрес\\"},{\\"value\\":\\"(867) 550-80-91\\",\\"label\\":\\"Телефон\\"}],\\"agreement\\":true,\\"idForMap\\":3,\\"expanded\\":true,\\"okato\\":\\"55000000000\\"}","timeSlotRequestAttrs":[{"name":"Startdate","value":"06.10.2021"},{"name":"Starttime","value":"00:00"},{"name":"Enddate","value":"20.10.2021"},{"name":"Endtime","value":"23:59"},{"name":"Session_Id","value":"f022067e-a026-4ee4-9160-0ab0d09ea569"},{"name":"Service_Id","value":"109::B04.014.004"},{"name":"ServiceSpec_Id","value":""},{"name":"MO_Id","value":"987"}],"bookingRequestAttrs":[{"name":"doctor","value":"врач-терапевт (Вакцинация)"},{"name":"anotherperson","value":"Y"},{"name":"genderperson","value":"Мужской"},{"name":"ageperson","value":"31"},{"name":"pacientname","value":"Ыть Ыть Ыть"}],"organizationId":"987","bookAttributes":"[{\\"name\\":\\"Session_Id\\",\\"value\\":\\"f022067e-a026-4ee4-9160-0ab0d09ea569\\"}]","userSelectedRegion":"55000000000"}',
    required: true,
  };

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

  const mockDepartment = {
    value: '',
    title: 'Поликлиника 7',
    attributeValues: {
      SpecId: 'specTest',
    },
  };

  const mockSpecLookup = {
    id: '200',
    text: 'Тестовая специальность',
  };

  const mockDocLookup = {
    id: '200',
    text: 'Тестовый врач',
    originalItem: {
      attributes: [
        {
          name: 'specId',
          value: '123',
        },
      ],
    },
  };

  beforeEach(() => {
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
        MockProvider(TimeSlotDoctorService),
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
        HtmlSelectService,
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
    httpCancelService = TestBed.inject(HttpCancelService);
    modalService = TestBed.inject(ModalService);
    timeSlotDoctorService = TestBed.inject(TimeSlotDoctorService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService = TestBed.inject(ScreenService);
    actionService = TestBed.inject(ActionService);
    datesHelperService = TestBed.inject(DatesToolsService);
    fixture = TestBed.createComponent(TimeSlotDoctorsContainerComponent);
    component = fixture.componentInstance;

    screenService.button = ({ label: 'test' } as unknown) as ScreenButton;
    screenService.component = (mockComponent as unknown) as ComponentDto;

    jest.spyOn(currentAnswersService, 'isValid$', 'get').mockReturnValue(of(true));

    component.timeSlotDoctors$ = of((mockComponent as unknown) as TimeSlotDoctorsComponentDto);
    component.today = new Date('2020-01-01T00:00:00Z');
    component.activeMonthNumber = 0;
    component.component = (mockComponent as unknown) as TimeSlotDoctorsComponentDto;

    timeSlotDoctorService.department = mockDepartment;
    timeSlotDoctorService.isOnlyDocLookupNeeded = true;
    timeSlotDoctorService.state$$ = new BehaviorSubject<TimeSlotDoctorState>({
      specLookup: null,
      docLookup: null,
      bookingRequestAttrs: null,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isToday()', () => {
    it('should return false', () => {
      const res = component.isToday(new Date('2020-02-01T00:00:00Z'));
      expect(res).toBeFalsy();
    });

    it('should return true', () => {
      const res = component.isToday(new Date('2020-01-01T00:00:00Z'));
      expect(res).toBeTruthy();
    });
  });

  describe('isDateOutOfMonth()', () => {
    it('should return false', () => {
      const res = component.isDateOutOfMonth(new Date('2020-02-01T00:00:00Z'));
      expect(res).toBeTruthy();
    });

    it('should return true', () => {
      const res = component.isDateOutOfMonth(new Date('2020-01-01T00:00:00Z'));
      expect(res).toBeFalsy();
    });
  });

  describe('chooseTimeSlot()', () => {
    it('should set time slot on selection', () => {
      const slot = {
        areaId: 'Кабинет отдела',
        slotId: 'a7164f5b-c5d6-4d47-9478-dcab86882695',
        slotTime: new Date('2021-03-20T10:00:00.000Z'),
        timezone: '00:00Z',
      };

      expect(component.currentSlot).toBeFalsy();
      expect(currentAnswersService.state).toBeFalsy();

      component.chooseTimeSlot(slot);

      expect(component.currentSlot).toEqual(slot);
      expect(currentAnswersService.state).toEqual(slot);
    });

    it('should clear time slot on the same slot selection', () => {
      const slot = {
        areaId: 'Кабинет отдела',
        slotId: 'a7164f5b-c5d6-4d47-9478-dcab86882695',
        slotTime: new Date('2021-03-20T10:00:00.000Z'),
        timezone: '00:00Z',
      };

      component.chooseTimeSlot(slot);

      expect(component.currentSlot).toEqual(slot);
      expect(currentAnswersService.state).toEqual(slot);

      component.chooseTimeSlot(slot);

      expect(component.currentSlot).toEqual(null);
      expect(currentAnswersService.state).toEqual(null);
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
  });

  describe('selectDate()', () => {
    beforeEach(() => {
      jest.spyOn<any, string>(component, 'clearDateSelection').mockReset();
      jest.spyOn<any, string>(component, 'recalcDaysStyles').mockReset();
    });

    it('if date is locked', () => {
      jest.spyOn(component, 'isDateLocked').mockReturnValue(true);

      component.selectDate(new Date('2020-01-01T00:00:00Z'));

      expect(component['clearDateSelection']).not.toHaveBeenCalled();
      expect(component['recalcDaysStyles']).not.toHaveBeenCalled();
    });

    it('if the date was chosen and we click again', () => {
      jest.spyOn(component, 'isDateLocked').mockReturnValue(false);
      component.date = new Date('2020-01-01T00:00:00Z');

      component.selectDate(new Date('2020-01-01T00:00:00Z'));

      expect(component['clearDateSelection']).toHaveBeenCalled();
      expect(component['recalcDaysStyles']).not.toHaveBeenCalled();
    });

    // TODO починить тест
    xit('if the date was changed', () => {
      jest.spyOn(component, 'isDateLocked').mockReturnValue(false);
      component.date = new Date('2020-01-15T00:00:00Z');

      component.selectDate(new Date('2020-01-01T00:00:00Z'));

      expect(component['clearDateSelection']).not.toHaveBeenCalled();
      expect(component['recalcDaysStyles']).toHaveBeenCalled();
    });
  });

  describe('checkExistenceSlots()', () => {
    it('when there is at least one date that is not locked', () => {
      component.weeks = [[{ date: new Date('2021-02-28T18:00:00.000Z'), number: 1 }]];
      jest.spyOn(component, 'isDateLocked').mockReturnValue(false);
      component.checkExistenceSlots();
      expect(component.isExistsSlots).toBe(true);
    });

    it('when there are all dates are locked', () => {
      component.weeks = [[{ date: new Date('2021-02-28T18:00:00.000Z'), number: 1 }]];
      jest.spyOn(component, 'isDateLocked').mockReturnValue(true);
      component.checkExistenceSlots();
      expect(component.isExistsSlots).toBe(false);
    });

    it('when there are no dates', () => {
      component.weeks = [];
      component.checkExistenceSlots();
      expect(component.isExistsSlots).toBe(false);
    });
  });

  describe('showError()', () => {
    it('show error and load timeslots by click on retry', () => {
      const confirmationModalParams = {
        ...COMMON_ERROR_MODAL_PARAMS,
        buttons: [
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
            value: 'Обычная ошибка',
          },
        ],
      };
      jest.spyOn<any, string>(component, 'loadTimeSlots');
      jest.spyOn(component, 'showModal').mockReturnValue(of('Обычная ошибка'));
      component.showError('Обычная ошибка');

      expect(component.showModal).toHaveBeenLastCalledWith(confirmationModalParams);
      expect(component['loadTimeSlots']).toHaveBeenCalled();
    });

    it('show error and not load timeslots by click on close', () => {
      const confirmationModalParams = {
        ...COMMON_ERROR_MODAL_PARAMS,
        buttons: [
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
            value: 'Обычная ошибка',
          },
        ],
      };
      jest.spyOn<any, string>(component, 'loadTimeSlots');
      jest.spyOn(component, 'showModal').mockReturnValue(of(null));
      component.showError('Обычная ошибка');

      expect(component.showModal).toHaveBeenLastCalledWith(confirmationModalParams);
      expect(component['loadTimeSlots']).not.toHaveBeenCalled();
    });
  });

  it('showModal()', () => {
    jest.spyOn(modalService, 'openModal');

    component.showModal(COMMON_ERROR_MODAL_PARAMS);

    expect(modalService.openModal).toHaveBeenLastCalledWith(
      ConfirmationModalComponent,
      COMMON_ERROR_MODAL_PARAMS,
    );
  });

  it('handleSpecLookupValue()', () => {
    jest.spyOn(component.timeSlotDoctorsComponent.docLookup, 'setFocus');
    jest.useFakeTimers();
    component.handleSpecLookupValue(mockSpecLookup);
    jest.runAllTimers();
    jest.useRealTimers();

    expect(timeSlotDoctorService.state$$.value).toEqual({
      bookingRequestAttrs: null,
      specLookup: mockSpecLookup,
      docLookup: null,
    });
    expect(component.docLookupControl.value).toEqual('');
    expect(component.timeSlotDoctorsComponent.docLookup.setFocus).toHaveBeenCalled();
  });

  // TODO починить тест
  xit('handleDocLookupValue()', () => {
    jest.spyOn<any, string>(component, 'loadTimeSlots');

    expect(component.doctorWasChosen$$.value).toEqual(false);

    component.handleDocLookupValue(mockDocLookup);

    expect(timeSlotDoctorService.state$$.value).toEqual({
      bookingRequestAttrs: { specId: '123' },
      specLookup: null,
      docLookup: mockDocLookup,
    });
    expect(component.doctorWasChosen$$.value).toEqual(true);
    expect(component['loadTimeSlots']).toHaveBeenCalled();
  });

  it('ngOnInit()', () => {
    jest.spyOn(datesHelperService, 'getToday').mockReturnValue(Promise.resolve(new Date('2020-01-01T00:00:00.000Z')));

    component.ngOnInit();

    expect(component.today).toEqual(new Date('2020-01-01T00:00:00.000Z'));
  });

  it('ngOnDestroy()', () => {
    jest.spyOn(httpCancelService, 'cancelPendingRequests');
    jest.spyOn(component.timeSlotDoctorsComponent.docLookup, 'setFocus');

    jest.useFakeTimers();
    component.handleSpecLookupValue(mockSpecLookup);
    jest.runAllTimers();
    jest.useRealTimers();

    expect(timeSlotDoctorService.state$$.value).toEqual({
      bookingRequestAttrs: null,
      specLookup: mockSpecLookup,
      docLookup: null,
    });

    component.ngOnDestroy();

    expect(timeSlotDoctorService.state$$.value).toEqual({
      bookingRequestAttrs: null,
      specLookup: null,
      docLookup: null,
    });
    expect(httpCancelService.cancelPendingRequests).toHaveBeenCalled();
  });

  describe('clickSubmit()', () => {
    it('should invoke bookTimeSlot function if there is no booked slot', () => {
      component.bookedSlot = null;

      jest.spyOn(component, 'bookTimeSlot').mockReturnValue(null);

      component.clickSubmit();

      expect(component.bookTimeSlot).toHaveBeenCalled();
    });

    it('should show confirmation modal', () => {
      component.bookedSlot = {
        slotTime: new Date('2021-08-28T09:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '',
      };

      jest.spyOn(component, 'showModal');
      jest.spyOn(component as any, 'isCachedValueChanged').mockImplementation(() => true);

      component.clickSubmit();

      expect(component.showModal).toHaveBeenLastCalledWith(component.confirmModalParameters);
    });

    it('should invoke next action process', () => {
      component.bookedSlot = {
        slotTime: new Date('2021-08-28T09:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '',
      };
      component['cachedAnswer'] = ({ bookId: '123' } as unknown) as TimeSlotsAnswerInterface;

      jest.spyOn(actionService, 'switchAction').mockReturnValue(null);
      jest.spyOn(component as any, 'isCachedValueChanged').mockImplementation(() => false);

      component.clickSubmit();

      expect(currentAnswersService.state).toEqual({ bookId: '123' });
      expect(actionService.switchAction).toHaveBeenLastCalledWith(
        NEXT_STEP_ACTION,
        'ts_doctor_ref',
      );
    });
  });

  describe('bookTimeSlot()', () => {
    beforeEach(() => {
      jest.spyOn(actionService, 'switchAction');
      jest.spyOn(component, 'showCustomError');
    });

    // TODO починить тест
    xit('should set state and invoke next action process (complex test)', () => {
      jest
        .spyOn(timeSlotDoctorService, 'checkBooking')
        .mockImplementation(() => of(({ bookId: 'test' } as unknown) as SmevBookResponseInterface));
      jest.spyOn<any, string>(component, 'loadTimeSlots');

      jest.useFakeTimers();
      component.handleSpecLookupValue(mockSpecLookup);
      jest.runAllTimers();
      jest.useRealTimers();

      component.handleDocLookupValue(mockDocLookup);

      component.bookTimeSlot();

      expect(component.inBookingProgress).toEqual(false);
      expect(component.showCustomError).not.toHaveBeenCalled();
      expect(currentAnswersService.state).toEqual({
        bookId: 'test',
        department: mockDepartment,
        docLookup: mockDocLookup,
        specLookup: mockSpecLookup,
      });
      expect(actionService.switchAction).toHaveBeenLastCalledWith(
        NEXT_STEP_ACTION,
        'ts_doctor_ref',
      );
    });

    it('when response is failed', () => {
      jest.spyOn(timeSlotDoctorService, 'checkBooking').mockImplementation(() =>
        throwError({
          error: {
            errorDetail: {
              errorMessage: 'Ошибка запроса',
            },
          },
        }),
      );
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockImplementation(() => 'Ошибка запроса');

      component.bookTimeSlot();

      expect(component.inBookingProgress).toEqual(false);
      expect(component.showCustomError).toHaveBeenLastCalledWith('Ошибка запроса');
      expect(actionService.switchAction).not.toHaveBeenLastCalledWith(NEXT_STEP_ACTION, 'test');
    });

    it('when response is OK but there is an error', () => {
      jest
        .spyOn(timeSlotDoctorService, 'checkBooking')
        .mockImplementation(() => of(({ bookId: 'test' } as unknown) as SmevBookResponseInterface));
      jest.spyOn(timeSlotDoctorService, 'hasError').mockImplementation(() => true);
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockImplementation(() => 'Ошибка справочника');

      component.bookTimeSlot();

      expect(component.inBookingProgress).toEqual(false);
      expect(component.showCustomError).toHaveBeenLastCalledWith('Ошибка справочника');
      expect(actionService.switchAction).not.toHaveBeenLastCalledWith(NEXT_STEP_ACTION, 'test');
    });
  });

  describe('showTimeSlots()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'showError');
    });

    it('should set timeslots and unset current slot', () => {
      const slots = [
        { slotTime: new Date('2021-08-28T09:00:00Z'), timezone: '', areaId: '', slotId: '' },
      ];
      jest.spyOn(timeSlotDoctorService, 'getAvailableSlots').mockImplementation(() => of(slots));

      component.showTimeSlots(new Date());

      expect(component.currentSlot).toEqual(null);
      expect(component.timeSlots).toEqual(slots);
      expect(component.showError).not.toHaveBeenCalled();
    });

    it('when response is failed', () => {
      jest
        .spyOn(timeSlotDoctorService, 'getAvailableSlots')
        .mockImplementation(() => throwError(''));
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockImplementation(() => 'Ошибка запроса');

      component.showTimeSlots(new Date());

      expect(component.currentSlot).toEqual(null);
      expect(component.timeSlots).toEqual(null);
      expect(component.showError).toHaveBeenLastCalledWith(
        `${component.constants.errorLoadingTimeSlots}  (Ошибка запроса)`,
      );
    });

    it('when response is OK but there is an error', () => {
      jest.spyOn(timeSlotDoctorService, 'hasError').mockImplementation(() => true);
      jest.spyOn(timeSlotDoctorService, 'getAvailableSlots').mockImplementation(() => of([]));
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockImplementation(() => 'Ошибка справочника');

      component.showTimeSlots(new Date());

      expect(component.currentSlot).toEqual(null);
      expect(component.timeSlots).toEqual(null);
      expect(component.showError).toHaveBeenLastCalledWith(
        `${component.constants.errorLoadingTimeSlots} (Ошибка справочника)`,
      );
    });
  });

  describe('showCustomError()', () => {
    it('when error is null', () => {
      jest.spyOn(component, 'showModal');
      component.showCustomError(null);
      expect(component.showModal).toHaveBeenLastCalledWith(COMMON_ERROR_MODAL_PARAMS);
    });

    it('when error is session timeout', () => {
      jest.spyOn(component, 'showModal');
      component.showCustomError('Закончилось время');
      expect(component.showModal).toHaveBeenLastCalledWith(SERVICE_OR_SPEC_SESSION_TIMEOUT);
    });

    it('when other error', () => {
      const confirmationModalParams = {
        ...ITEMS_FAILURE,
        buttons: [
          {
            label: 'Начать заново',
            color: 'white',
            closeModal: true,
            value: 'init',
          },
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
          },
        ],
      } as ConfirmationModal;
      confirmationModalParams.text = confirmationModalParams.text.replace(
        /\{textAsset\}?/g,
        'Другая ошибка',
      );

      jest.spyOn(component, 'showModal');
      component.showCustomError('Другая ошибка');
      expect(component.showModal).toHaveBeenLastCalledWith(confirmationModalParams);
    });

    it('when error from lkApi (doctors)', () => {
      const confirmationModalParams = {
        ...ITEMS_FAILURE,
        buttons: [
          {
            label: 'Начать заново',
            color: 'white',
            closeModal: true,
            value: 'init',
          },
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
          },
        ],
      } as ConfirmationModal;
      confirmationModalParams.text = confirmationModalParams.text.replace(
        /\{textAsset\}?/g,
        'Другая ошибка',
      );

      jest.spyOn(component, 'showModal');

      component.showCustomError('FAILURE:Другая ошибка');
      expect(component.showModal).toHaveBeenLastCalledWith(confirmationModalParams);

      component.showCustomError('UNKNOWN_REQUEST_DESCRIPTION:Другая ошибка');
      expect(component.showModal).toHaveBeenLastCalledWith(confirmationModalParams);

      component.showCustomError('NO_DATA:Другая ошибка');
      expect(component.showModal).toHaveBeenLastCalledWith(confirmationModalParams);
    });
  });

  describe('focusOnFirstLookup()', () => {
    beforeEach(() => {
      jest.spyOn(component.timeSlotDoctorsComponent.docLookup, 'setFocus');
      jest.spyOn(component.timeSlotDoctorsComponent.specLookup, 'setFocus');
    });

    it('if only doc lookup is needed', () => {
      timeSlotDoctorService.isOnlyDocLookupNeeded = true;

      component.focusOnFirstLookup();

      expect(component.timeSlotDoctorsComponent.specLookup.setFocus).not.toHaveBeenCalled();
      expect(component.timeSlotDoctorsComponent.docLookup.setFocus).toHaveBeenCalled();
    });

    it('if both lookups are needed', () => {
      timeSlotDoctorService.isOnlyDocLookupNeeded = false;

      component.focusOnFirstLookup();

      expect(component.timeSlotDoctorsComponent.specLookup.setFocus).toHaveBeenCalled();
      expect(component.timeSlotDoctorsComponent.docLookup.setFocus).not.toHaveBeenCalled();
    });
  });

  describe('handleMessageError() after request on getting timeslots', () => {
    beforeEach(() => {
      component.component.attrs.ts.slotsNotFoundTemplate = null;
    });

    it('errorMessage 101', () => {
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockReturnValue((101 as unknown) as string);

      component.handleMessageError();

      expect(component.errorMessage).toEqual('101: сервис недоступен. Повторите запрос позже.');
    });

    it('session timeout error', () => {
      jest.spyOn(component, 'showModal');
      jest.spyOn(timeSlotDoctorService, 'getErrorMessage').mockReturnValue('Закончилось время');

      component.handleMessageError();

      expect(component.showModal).toHaveBeenCalled();
    });

    it('slots not found error when there is a template to show (vaccination)', () => {
      jest.spyOn(component, 'showModal');
      jest.spyOn(timeSlotDoctorService, 'getErrorMessage').mockReturnValue('');

      component.component.attrs.ts.slotsNotFoundTemplate = ({} as unknown) as SlotsNotFoundTemplate;

      component.handleMessageError();

      expect(component.areSlotsNotAvailable).toBeTruthy();
      expect(component.showModal).not.toHaveBeenCalled();
    });

    it('no data error when there is a template to show (doctors)', () => {
      jest.spyOn(component, 'showModal');
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockReturnValue('В настоящее время отсутствуют медицинские должности');
      component.handleMessageError();

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.showModal).not.toHaveBeenCalled();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: `
            <h6 class='yellow-line mt-24'>
              Нет свободного времени для приёма
            </h6>`,
        description: `
            <div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
              Этот врач занят на ближайшие 14 дней. Выберите другого специалиста
            </div>`,
      });
    });

    it('other error - FAILURE type (doctors)', () => {
      jest.spyOn(component, 'showModal');
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockReturnValue('FAILURE:Что-то произошло');
      component.handleMessageError();

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.showModal).not.toHaveBeenCalled();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: `
            <h6 class='yellow-line mt-24'>
              Нет свободного времени для приёма
            </h6>`,
        description: `
            <div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
              Что-то произошло
            </div>`,
      });
    });

    it('other error - UNKNOWN_REQUEST_DESCRIPTION type (doctors)', () => {
      jest.spyOn(component, 'showModal');
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockReturnValue('UNKNOWN_REQUEST_DESCRIPTION:Что-то произошло');
      component.handleMessageError();

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.showModal).not.toHaveBeenCalled();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: `
            <h6 class='yellow-line mt-24'>
              Нет свободного времени для приёма
            </h6>`,
        description: `
            <div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
              Что-то произошло
            </div>`,
      });
    });

    it('other error - NO_DATA type (doctors)', () => {
      jest.spyOn(component, 'showModal');
      jest
        .spyOn(timeSlotDoctorService, 'getErrorMessage')
        .mockReturnValue('NO_DATA:Что-то произошло');
      component.handleMessageError();

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.showModal).not.toHaveBeenCalled();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: `
            <h6 class='yellow-line mt-24'>
              Нет свободного времени для приёма
            </h6>`,
        description: `
            <div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
              Что-то произошло
            </div>`,
      });
    });
  });

  describe('handleLookupProviderErrorMessage()', () => {
    it('don\'t need to handle and show template', () => {
      component.handleLookupProviderErrorMessage(null, null);
      expect(component.isDoctorNotAvailable).toBeFalsy();

      component.handleLookupProviderErrorMessage('Operation completed', null);
      expect(component.isDoctorNotAvailable).toBeFalsy();

      component.handleLookupProviderErrorMessage(SMEV2_SERVICE_OR_SPEC_SESSION_TIMEOUT, null);
      expect(component.isDoctorNotAvailable).toBeFalsy();

      component.handleLookupProviderErrorMessage(SMEV3_SERVICE_OR_SPEC_NO_AVAILABLE, null);
      expect(component.isDoctorNotAvailable).toBeFalsy();

      component.handleLookupProviderErrorMessage('Ошибка', 'ServiceOrSpecs');
      expect(component.isDoctorNotAvailable).toBeFalsy();
    });

    it('handle error and show standard template', () => {
      component.handleLookupProviderErrorMessage('Ошибка', '');

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: '<h6 class=\'yellow-line mt-24\'>Врачи не найдены</h6>',
        description: `<div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
      Ошибка
    </div>`,
      });
    });

    it('handle error and show template that doctors are not available next 2 weeks', () => {
      component.handleLookupProviderErrorMessage(
        'FAILURE:должности в ближайшие 14 дней нет доступного времени',
        '',
      );

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: '<h6 class=\'yellow-line mt-24\'>Врачи не найдены</h6>',
        description: `<div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
      Выберите другую специальность врача или <a data-action-type='prevStep'>другую медицинскую организацию</a>
    </div>`,
      });
    });

    it('handle FAILURE type error and show template', () => {
      component.handleLookupProviderErrorMessage('FAILURE:Ошибка', '');

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: '<h6 class=\'yellow-line mt-24\'>Врачи не найдены</h6>',
        description: `<div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
      Ошибка
    </div>`,
      });
    });

    it('handle UNKNOWN_REQUEST_DESCRIPTION type error and show template', () => {
      component.handleLookupProviderErrorMessage('UNKNOWN_REQUEST_DESCRIPTION:Ошибка', '');

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: '<h6 class=\'yellow-line mt-24\'>Врачи не найдены</h6>',
        description: `<div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
      Ошибка
    </div>`,
      });
    });

    it('handle NO_DATA type error and show template', () => {
      component.handleLookupProviderErrorMessage('NO_DATA:Ошибка', '');

      expect(component.isDoctorNotAvailable).toBeTruthy();
      expect(component.doctorsNotFoundTemplate).toEqual({
        header: '<h6 class=\'yellow-line mt-24\'>Врачи не найдены</h6>',
        description: `<div class='mt-6 text-color--text-helper' style='font-size: 14px; margin-top: 6px;'>
      Ошибка
    </div>`,
      });
    });
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

  it('checkDateRestrictions with mock\'s restrictions', () => {
    const checkDateRestrictions = component['checkDateRestrictions'].bind(component);
    let date = new Date('2020-01-01T10:00:00.000Z');
    let check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2020-01-05T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2021-01-01T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2021-12-31T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2020-03-01T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeFalsy();
  });

  it('getMonthsListItem()', () => {
    const getMonthsListItem = component['getMonthsListItem'].bind(component);

    const listItem = getMonthsListItem('2010-01');

    expect(listItem).toEqual(
      new ListItem({
        id: '2010-01',
        text: 'Январь 2010',
      }),
    );
  });
});
