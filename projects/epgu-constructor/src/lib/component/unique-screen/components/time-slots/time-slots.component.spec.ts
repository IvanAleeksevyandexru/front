import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ScreenPadComponent,
  HelperTextComponent,
  HttpCancelService,
  TimeCalendarModule,
  ObjectHelperService,
  SessionService,
  BaseUiModule,
  ConstructorCheckboxModule,
  IDay,
  ScreenContainerComponent,
  ConfigService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  LoggerService,
  LoggerServiceStub,
  DatesToolsService,
  DownloadService,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockComponents, MockProvider } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { cloneDeep } from 'lodash';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ListItem } from '@epgu/ui/models/dropdown';
import { FormsModule } from '@angular/forms';
import { IBookingErrorHandling } from '@epgu/epgu-constructor-types';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { TimeSlotsComponent } from './time-slots.component';

import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';

import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';

import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { mockScreenDivorceStore } from './mocks/mock-screen-divorce-store';
import { ScreenStore } from '../../../../screen/screen.types';
import { Smev3TimeSlotsRestServiceStub } from './stubs/smev3-time-slots-rest.service.stub';

import { TimeSlotsService } from './time-slots.service';

import { EMPTY_SLOT, mockEmptySlots, mockSlots, slotsError } from './mocks/mock-time-slots';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { SmevSlotsResponseInterface } from './time-slots.types';

import { mockWeeks } from './mocks/mock-weeks';
import { mockScreenMvdStore } from './mocks/mock-screen-mvd-store';
import { mockScreenDoctorStore } from './mocks/mock-screen-doctor-store';
import { mockSlotsDoctor202106 } from './mocks/mock-time-slots_doctors';
import { Smev2TimeSlotsRestService } from './smev2-time-slots-rest.service';
import { Smev2TimeSlotsRestServiceStub } from './stubs/smev2-time-slots-rest.service.stub';
import { FormPlayerServiceStub } from '../../../../form-player/services/form-player/form-player.service.stub';
import { FormPlayerService } from '../../../../form-player/services/form-player/form-player.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import {
  ITEMS_FAILURE,
  SERVICE_OR_SPEC_SESSION_TIMEOUT,
} from '../../../../core/services/error-handler/error-handler';
import { HelperService } from '@epgu/ui/services/helper';

describe('TimeSlotsComponent', () => {
  let component: TimeSlotsComponent;
  let fixture: ComponentFixture<TimeSlotsComponent>;
  let screenService: ScreenServiceStub;
  let timeSlotsService: TimeSlotsService;
  let currentAnswersService: CurrentAnswersService;
  let smev3TimeSlotsRestService: Smev3TimeSlotsRestService;
  let store: ScreenStore;
  let httpClient: HttpClient;

  beforeEach(() => {
    Date.now = jest.fn().mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TimeCalendarModule,
        BaseUiModule,
        FormsModule,
        ScreenButtonsModule,
        ConstructorCheckboxModule,
      ],
      declarations: [
        TimeSlotsComponent,
        MockComponents(
          ScreenPadComponent,
          HelperTextComponent,
          PageNameComponent,
          ScreenContainerComponent,
          OutputHtmlComponent,
        ),
      ],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: Smev3TimeSlotsRestService, useClass: Smev3TimeSlotsRestServiceStub },
        { provide: Smev2TimeSlotsRestService, useClass: Smev2TimeSlotsRestServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        MockProvider(DictionaryToolsService),
        MockProvider(HelperService),
        CurrentAnswersService,
        TimeSlotsConstants,
        DatesToolsService,
        TimeSlotsService,
        DownloadService,
        ObjectHelperService,
        HttpCancelService,
        JsonHelperService,
        SessionService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    timeSlotsService = TestBed.inject(TimeSlotsService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    smev3TimeSlotsRestService = TestBed.inject(Smev3TimeSlotsRestService);
    httpClient = TestBed.inject(HttpClient);
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    // @ts-ignore
    store = cloneDeep(mockScreenDivorceStore);
    screenService.initScreenStore(store);
    fixture = TestBed.createComponent(TimeSlotsComponent);
    component = fixture.componentInstance;

    let cachedAnswer = screenService.getCompValueFromCachedAnswers();
    if (cachedAnswer) {
      cachedAnswer = JSON.parse(cachedAnswer);
    }
    jest
      .spyOn(timeSlotsService as any, 'getAvailableAreaNames')
      .mockReturnValue(of(['?????????????? ????????????', '?????? ????????????']));
    jest
      .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
      .mockReturnValue(of(mockSlots as SmevSlotsResponseInterface));

    jest.spyOn(httpClient, 'get').mockImplementationOnce((url, options) => {
      if (url === '/api/service/actions/currentDateTime') {
        return of('2021-01-01T00:00:00.000Z');
      }
      return httpClient.get(url, options);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle confirmation modal result if there is no confirmation', () => {
    component.bookedSlot = {
      slotTime: new Date('2021-08-28T09:00:00Z'),
      timezone: '',
      areaId: '',
      slotId: '',
    };

    jest.spyOn(component, 'showModal');
    jest.spyOn(component as any, 'isCachedValueChanged').mockImplementation(() => true);
    jest.spyOn(component as any, 'showModal').mockImplementation(() => of(false));
    const clearDateSelectionSpy = jest.spyOn<any, any>(component, 'clearDateSelection');
    const selectDateSpy = jest.spyOn<any, any>(component, 'selectDate');
    const chooseTimeSlotSpy = jest.spyOn<any, any>(component, 'chooseTimeSlot');

    component.clickSubmit();

    expect(clearDateSelectionSpy).toHaveBeenCalled();
    expect(selectDateSpy).toHaveBeenLastCalledWith(component.bookedSlot.slotTime);
    expect(chooseTimeSlotSpy).toHaveBeenLastCalledWith(component.bookedSlot);
  });

  it('set bookingErrorHandlingParams as empty array if there in no bookingErrorHandlingParams in component attrs ', () => {
    component.ngOnInit();
    expect(component.bookingErrorHandlingParams).toEqual([]);
  });

  it('setting bookingErrorHandlingParams ', () => {
    const mockBookingErrorHandling = [
      ({
        errorCode: 2,
      } as unknown) as IBookingErrorHandling,
    ];
    // @ts-ignore
    screenService.component.attrs?.bookingErrorHandling = mockBookingErrorHandling;

    component.ngOnInit();

    expect(component.bookingErrorHandlingParams).toEqual(mockBookingErrorHandling);
  });

  it('should show loader while slots loading', () => {
    component.inLoadingSlotsProgress = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.lib-loader'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.screen-footer'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.time-slots-content'))).toBeNull();
  });

  it('should show content when slots are loaded with an error', () => {
    component.inLoadingSlotsProgress = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.lib-loader'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.screen-footer'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.time-slots-content'))).toBeTruthy();
  });

  it('should show content when slots are loaded without errors', () => {
    component.inLoadingSlotsProgress = false;
    component.weeks = ([[]] as unknown) as IDay[][];
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.lib-loader'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.screen-footer'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.time-slots-content'))).toBeTruthy();
  });

  it('correct format of chosenTimeStr', () => {
    const slot = {
      areaId: '?????????????? ????????????',
      slotId: 'a7164f5b-c5d6-4d47-9478-dcab86882695',
      slotTime: new Date('2021-03-20T10:00:00.000Z'),
      timezone: '00:00Z',
    };
    component.setBookedTimeStr(slot);
    expect(component.chosenTimeStr).toBe('20 ?????????? 2021 ???????? ?? 10:00, ??????????????');
  });

  it('cachedAnswer is not empty', () => {
    fixture.detectChanges();
    const { cachedAnswer } = component;

    expect(cachedAnswer?.department?.value).toBe('R7700028');
  });

  it('should set time slot on selection', () => {
    const slot = {
      areaId: '?????????????? ????????????',
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
      areaId: '?????????????? ????????????',
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

  it("checkDateRestrictions with mock's restrictions", () => {
    component.today = new Date('2020-12-31T21:00:00.000Z');

    const checkDateRestrictions = component.checkDateRestrictions.bind(component);
    let date = new Date('2020-01-01T10:00:00.000Z');
    let check = checkDateRestrictions(date);

    expect(check).toBeTruthy();
    date = new Date('2020-02-01T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2021-01-01T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2020-12-31T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2021-03-01T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeFalsy();
  });

  it('calcing of isBookedDepartment as true', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const { isBookedDepartment } = component.timeSlotsService;
    expect(isBookedDepartment).toBeTruthy();
  });

  it('calcing of isBookedDepartment as false if value changed', () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    department.value = 'temp';
    compValue.department = JSON.stringify(department);
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    const { isBookedDepartment } = component.timeSlotsService;
    expect(isBookedDepartment).toBeFalsy();
  });

  it('calcing of isBookedDepartment as false if area_name changed for BRAK', () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    compValue.timeSlotType = 'BRAK';
    department.attributeValues.AREA_NAME = 'temp';
    compValue.department = JSON.stringify(department);
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    const { isBookedDepartment } = component.timeSlotsService;
    expect(isBookedDepartment).toBeFalsy();
  });

  it('generate new uuid in case of waitingTimeExpired', async () => {
    const compValue = JSON.parse(screenService.component.value);
    compValue.waitingTimeExpired = true;
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    await fixture.whenStable();
    const oldBookid = component.timeSlotsService.bookId;
    component.timeSlotsService.getBookRequest(EMPTY_SLOT);
    const newBookid = component.timeSlotsService.bookId;
    expect(oldBookid).not.toMatch(newBookid);
  });

  it('not generate new uuid in case of not waitingTimeExpired', async () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    let isBookedDepartment = component.timeSlotsService?.isBookedDepartment;
    fixture.detectChanges();
    await fixture.whenStable();
    isBookedDepartment = component.timeSlotsService.isBookedDepartment;
    const oldBookid = component.timeSlotsService.bookId;
    component.timeSlotsService.getBookRequest(EMPTY_SLOT);
    const newBookid = component.timeSlotsService.bookId;
    expect(oldBookid).toMatch(newBookid);
  });

  it('should send cancel before book in case of waitingTimeExpired', async () => {
    const compValue = JSON.parse(screenService.component.value);
    compValue.waitingTimeExpired = true;
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    await fixture.whenStable();
    // @ts-ignore
    const cancelRequestSpy = jest.spyOn(component.timeSlotsService, 'cancelSlot');
    component.timeSlotsService.checkBooking(EMPTY_SLOT);
    expect(cancelRequestSpy).toBeCalledTimes(1);
  });

  it('bookedSlot should be null if waitingTimeExpired is true', () => {
    const compValue = JSON.parse(screenService.component.value);
    compValue.waitingTimeExpired = true;
    screenService.component.value = JSON.stringify(compValue);
    component.loadTimeSlots();
    fixture.detectChanges();
    const { bookedSlot } = component;
    expect(bookedSlot).toBeNull();
  });

  it('MVD should contain caseNumber and empty parentOrderId', async () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    compValue.timeSlotType = 'MVD';
    department.attributeValues.AREA_NAME = 'temp';
    compValue.department = JSON.stringify(department);
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    await fixture.whenStable();
    const reqBody = component.timeSlotsService.getBookRequest(EMPTY_SLOT);
    expect(reqBody.caseNumber).toBeTruthy();
    expect(reqBody.parentOrderId).toEqual('');
  });

  describe('when there is at least one date that is not locked', () => {
    it('checkExistenceSlots should set isExistsSlots to true', () => {
      component.weeks = [[{ date: new Date('2021-02-28T18:00:00.000Z'), number: 1 }]];
      jest.spyOn(component, 'isDateLocked').mockReturnValue(false);
      component.checkExistenceSlots();
      expect(component.isExistsSlots).toBe(true);
    });
  });

  describe('when there are all dates are locked', () => {
    it('checkExistenceSlots should set isExistsSlots to false', () => {
      component.weeks = [[{ date: new Date('2021-02-28T18:00:00.000Z'), number: 1 }]];
      jest.spyOn(component, 'isDateLocked').mockReturnValue(true);
      component.checkExistenceSlots();
      expect(component.isExistsSlots).toBe(false);
    });
  });

  describe('when there are no dates', () => {
    it('checkExistenceSlots should not be changed', () => {
      component.weeks = [];
      component.checkExistenceSlots();
      expect(component.isExistsSlots).toBe(false);
    });
  });

  it('renderSingleMonthGrid works as before', async () => {
    jest.spyOn(component, 'renderSingleMonthGrid').mockReturnValueOnce(null);
    fixture.detectChanges();
    await fixture.whenStable();

    const actual = [];
    const expected = mockWeeks;
    component.activeMonthNumber = undefined;
    component.activeYearNumber = undefined;
    component.renderSingleMonthGrid(actual);
    expect(actual).toEqual(expected);
  });

  describe('when dateType is today', () => {
    beforeEach(() => {
      const todayStr = '2021-02-15T00:00:00.000Z';
      Date.now = jest.fn().mockReturnValue(new Date(todayStr));
      jest.spyOn(httpClient, 'get').mockRestore();
      jest.spyOn(httpClient, 'get').mockImplementationOnce((url, options) => {
        if (url === '/api/service/actions/currentDateTime') {
          return of(todayStr);
        }
        return httpClient.get(url, options);
      });
      screenService.component.attrs.dateType = 'today';
      screenService.component.attrs.restrictions = { minDate: [30 + 3, 'd'], maxDate: [1, 'y'] };
    });

    it('should allow book date in 30+3 days after today', async () => {
      component.isDateLocked = jest.fn((date: Date) => component.checkDateRestrictions(date));

      fixture.detectChanges();
      await fixture.whenStable();
      const allDays = fixture.debugElement.queryAll(By.css('.calendar-day'));
      expect(allDays.length).toEqual(35);

      const lockedDays = fixture.debugElement.queryAll(By.css('.calendar-day.locked'));
      expect(lockedDays.length).toEqual(19);
    });

    it('should recalc days styles after change area', async () => {
      const compValue = JSON.parse(screenService.component.value);
      compValue.timeSlotType = 'BRAK';
      screenService.component.attrs.restrictions = { minDate: [0, 'd'], maxDate: [1, 'y'] };
      screenService.component.value = JSON.stringify(compValue);
      await fixture.detectChanges();
      await fixture.whenStable();

      const lockedDays = fixture.debugElement.queryAll(By.css('.calendar-day.locked'));
      expect(lockedDays.length).toEqual(31);

      fixture.componentInstance.currentArea = {
        id: '?????????????????????????? (?????????????? ????????????????????)',
        text: '?????????????????????????? (?????????????? ????????????????????)',
      } as ListItem;
      fixture.componentInstance.areaChanged();
      let i = 0;
      fixture.componentInstance.weeks.forEach((week) => {
        week.forEach((day) => {
          if (day.classes.locked) {
            i++;
          }
        });
      });
      expect(i).toEqual(30);
    });

    it('should draw days equal to daysToShow extended to weeks length', async () => {
      component.isDateLocked = jest.fn((date: Date) => component.checkDateRestrictions(date));
      screenService.component.attrs.daysToShow = 15;
      await fixture.detectChanges();
      await fixture.whenStable();
      const allDays = fixture.debugElement.queryAll(By.css('.calendar-day'));
      expect(allDays.length).toEqual(21);
    });
  });

  describe('when dateType is refDate', () => {
    beforeEach(() => {
      const todayStr = '2021-02-05T00:00:00.000Z';
      screenService.component.attrs.dateType = 'refDate';
      screenService.component.attrs.refDate = todayStr;
      jest.spyOn(httpClient, 'get').mockRestore();
      jest.spyOn(httpClient, 'get').mockImplementationOnce((url, options) => {
        if (url === '/api/service/actions/currentDateTime') {
          return of(todayStr);
        }
        return httpClient.get(url, options);
      });
      screenService.component.attrs.restrictions = { minDate: [30 + 3, 'd'], maxDate: [1, 'y'] };
      component.isDateLocked = jest.fn((date: Date) => component.checkDateRestrictions(date));
      fixture.detectChanges();
    });

    it('should allow book date in 30+3 days after today', () => {
      const allDays = fixture.debugElement.queryAll(By.css('.calendar-day'));
      expect(allDays.length).toEqual(35);

      const lockedDays = fixture.debugElement.queryAll(By.css('.calendar-day.locked'));
      expect(lockedDays.length).toEqual(9);
    });
  });

  it('should call modal for no slots case', async () => {
    const modalParams = { text: 'temp' };
    store.display.components[0].attrs.emptySlotsModal = modalParams;
    screenService.initScreenStore(store);
    const modalSpy = jest.spyOn(component, 'showModal');
    jest
      .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
      .mockReturnValue(of(mockEmptySlots as SmevSlotsResponseInterface));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalSpy).toBeCalledWith(modalParams);
  });

  it('should not call modal for no slots case and without options', () => {
    const modalSpy = jest.spyOn(component, 'showModal');
    timeSlotsService.slotsMap = [];
    fixture.detectChanges();
    expect(modalSpy).not.toBeCalled();
  });

  it('should call error modal if slots request returned error', async () => {
    jest
      .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
      .mockReturnValue(of(slotsError as SmevSlotsResponseInterface));
    const modalSpy = jest.spyOn(component, 'showError').mockImplementation((errorMessage) => {
      return errorMessage;
    });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalSpy).toBeCalled();
  });

  describe('should forbid select locked date', () => {
    beforeEach(async () => {
      const todayStr = '2021-06-23T00:00:00.000Z';
      Date.now = jest.fn().mockReturnValue(new Date(todayStr));
      jest.spyOn(smev3TimeSlotsRestService, 'getTimeSlots').mockRestore();
      jest
        .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
        .mockReturnValue(of(mockSlotsDoctor202106 as SmevSlotsResponseInterface));
      jest.spyOn(httpClient, 'get').mockRestore();
      jest.spyOn(httpClient, 'get').mockImplementationOnce((url, options) => {
        if (url === '/api/service/actions/currentDateTime') {
          return of(todayStr);
        }
        return httpClient.get(url, options);
      });
    });

    function checks(allowedMap) {
      component.weeks.forEach((week) => {
        week.forEach((day) => {
          const key = `${day.date.getFullYear()}${day.date.getMonth()}${day.date.getDate()}`;
          component.selectDate(day.date);
          expect(component.date).toEqual(allowedMap[key] ? component.date : null);
          component.date = null;
        });
      });
    }

    it('MVD', async () => {
      // @ts-ignore
      store = cloneDeep(mockScreenMvdStore);
      screenService.initScreenStore(store);
      await fixture.detectChanges();
      await fixture.whenStable();
      const allowedMap = {
        2021523: true,
        2021526: true,
        2021529: true,
      };
      checks(allowedMap);
    });

    it('DOCTOR', async () => {
      // @ts-ignore
      store = cloneDeep(mockScreenDoctorStore);
      screenService.initScreenStore(store);
      await fixture.detectChanges();
      await fixture.whenStable();
      const allowedMap = {
        2021523: true,
        2021526: true,
        2021529: true,
        202162: true,
        202165: true,
      };
      checks(allowedMap);
    });
  });

  describe('showTimeSlots()', () => {
    it('should leave timeslots unchanged', () => {
      const slots = [
        { slotTime: new Date('2021-08-28T09:00:00Z'), timezone: '', areaId: '', slotId: '' },
      ];
      jest.spyOn(timeSlotsService, 'getAvailableSlots').mockImplementation((...args) => of(slots));
      component.bookedSlot = {
        slotTime: new Date('2021-08-27T09:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '',
      };

      component.showTimeSlots(new Date());

      expect(component.timeSlots.length).toEqual(1);
    });

    it('should insert booked slot at start', () => {
      const slots = [
        { slotTime: new Date('2021-08-28T09:00:00Z'), timezone: '', areaId: '', slotId: '' },
        { slotTime: new Date('2021-08-28T10:00:00Z'), timezone: '', areaId: '', slotId: '' },
      ];
      jest.spyOn(timeSlotsService, 'getAvailableSlots').mockImplementation((...args) => of(slots));
      component.bookedSlot = {
        slotTime: new Date('2021-08-28T08:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '1',
      };

      component.showTimeSlots(new Date());

      expect(component.timeSlots[0]).toEqual(component.bookedSlot);
    });

    it('should insert booked slot at end', () => {
      const slots = [
        { slotTime: new Date('2021-08-28T08:00:00Z'), timezone: '', areaId: '', slotId: '' },
        { slotTime: new Date('2021-08-28T09:00:00Z'), timezone: '', areaId: '', slotId: '' },
      ];
      jest.spyOn(timeSlotsService, 'getAvailableSlots').mockImplementation((...args) => of(slots));
      component.bookedSlot = {
        slotTime: new Date('2021-08-28T10:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '1',
      };

      component.showTimeSlots(new Date());

      expect(component.timeSlots[component.timeSlots.length - 1]).toEqual(component.bookedSlot);
    });

    it('should insert booked slot in between', () => {
      const slots = [
        { slotTime: new Date('2021-08-28T09:00:00Z'), timezone: '', areaId: '', slotId: '' },
        { slotTime: new Date('2021-08-28T11:00:00Z'), timezone: '', areaId: '', slotId: '' },
      ];
      jest.spyOn(timeSlotsService, 'getAvailableSlots').mockImplementation((...args) => of(slots));
      component.bookedSlot = {
        slotTime: new Date('2021-08-28T10:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '1',
      };

      component.showTimeSlots(new Date());

      expect(component.timeSlots[1]).toEqual(component.bookedSlot);
    });

    it('should insert booked slot at right position', () => {
      const slots = [
        { slotTime: new Date('2021-08-28T09:00:00Z'), timezone: '', areaId: '', slotId: '' },
        { slotTime: new Date('2021-08-28T10:00:00Z'), timezone: '', areaId: '', slotId: '' },
        { slotTime: new Date('2021-08-28T11:00:00Z'), timezone: '', areaId: '', slotId: '' },
        { slotTime: new Date('2021-08-28T13:00:00Z'), timezone: '', areaId: '', slotId: '' },
      ];

      jest.spyOn(timeSlotsService, 'getAvailableSlots').mockImplementation((...args) => of(slots));
      component.bookedSlot = {
        slotTime: new Date('2021-08-28T12:00:00Z'),
        timezone: '',
        areaId: '',
        slotId: '1',
      };

      component.showTimeSlots(new Date());

      expect(component.timeSlots[3]).toEqual(component.bookedSlot);
    });
  });

  describe('bookTimeSlot()', () => {
    let errorResponseMock;
    beforeEach(() => {
      errorResponseMock = {
        bookId: null,
        esiaId: null,
        status: {
          statusCode: null,
          statusMessage: null,
        },
        timeSlot: null,
        error: {
          errorDetail: {
            errorCode: 3333,
            errorMessage: 'i am error',
          },
          fieldErrors: [],
        },
        timeStart: null,
        timeFinish: null,
      };
    });
    it('should handle ?????????????????????? ?????????? error', () => {
      errorResponseMock.error.errorDetail.errorMessage = '?????????????????????? ??????????';
      jest
        .spyOn(timeSlotsService, 'checkBooking')
        .mockImplementation((...args) => throwError(errorResponseMock as any));
      const spy = jest.spyOn(component, 'showModal');

      component.bookTimeSlot();

      expect(spy).toHaveBeenCalledWith(SERVICE_OR_SPEC_SESSION_TIMEOUT);
    });

    it('should handle errors described in json', () => {
      const testModalParams = {
        title: '',
        text: '',
        showCloseButton: false,
        showCrossButton: false,
        buttons: [
          {
            label: '???? ??????????????',
            closeModal: true,
            color: 'white',
            action: {
              type: 'redirectToLK',
            },
          },
        ],
      };
      component.bookingErrorHandlingParams = [
        {
          errorCode: '2',
          modalAttributes: testModalParams as any,
        },
      ];
      timeSlotsService.errorMessage = 'i am error';
      errorResponseMock.error.errorDetail.errorCode = 2;
      jest
        .spyOn(timeSlotsService, 'checkBooking')
        .mockImplementation((...args) => throwError(errorResponseMock as any));
      const spy = jest.spyOn(component, 'showModal');

      component.bookTimeSlot();

      expect(spy).toHaveBeenCalledWith(testModalParams);
    });

    it('should handle errors described in json with RegExp', () => {
      const testModalParams = {
        title: '',
        text: '',
        showCloseButton: false,
        showCrossButton: false,
        buttons: [
          {
            label: '???? ??????????????',
            closeModal: true,
            color: 'white',
            action: {
              type: 'redirectToLK',
            },
          },
        ],
      };
      component.bookingErrorHandlingParams = [
        {
          errorCode: '2',
          errorMessageRegExp: 'test123',
          modalAttributes: testModalParams as any,
        },
      ];
      timeSlotsService.errorMessage = 'i am error';
      errorResponseMock.error.errorDetail.errorCode = 2;
      errorResponseMock.error.errorDetail.errorMessage = 'test123';
      jest
        .spyOn(timeSlotsService, 'checkBooking')
        .mockImplementation((...args) => throwError(errorResponseMock as any));
      const spy = jest.spyOn(component, 'showModal');

      component.bookTimeSlot();

      expect(spy).toHaveBeenCalledWith(testModalParams);
    });

    it('should call default error modal if no familiar condition is met ', () => {
      const params = {
        ...ITEMS_FAILURE,
        buttons: [
          {
            label: '???????????? ????????????',
            closeModal: true,
            value: 'init',
          },
          {
            label: '?????????????????????? ?????? ??????',
            closeModal: true,
          },
        ],
      };
      component.bookingErrorHandlingParams = [
        {
          errorCode: '2',
          errorMessageRegExp: 'test123',
          modalAttributes: {} as any,
        },
      ];
      errorResponseMock.error.errorDetail.errorMessage = '{textAsset}';
      jest
        .spyOn(timeSlotsService, 'checkBooking')
        .mockImplementation((...args) => throwError(errorResponseMock as any));
      const spy = jest.spyOn(component, 'showModal');

      component.bookTimeSlot();

      expect(spy).toHaveBeenCalledWith(params);
    });

    it('should not show any modals if no errors thrown ', () => {
      timeSlotsService.errorMessage = null;
      jest
        .spyOn(timeSlotsService, 'checkBooking')
        .mockImplementation((...args) => throwError(errorResponseMock as any));
      const spy = jest.spyOn(component, 'showModal');

      component.bookTimeSlot();

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
