import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule, ListItem } from '@epgu/epgu-lib';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ScreenPadComponent, HelperTextComponent } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotsComponent } from './time-slots.component';
import { MockComponents } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { TimeSlotsConstants } from './time-slots.constants';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { mockScreenDivorceStore } from './mocks/mock-screen-divorce-store';
import { ScreenStore } from 'projects/epgu-constructor/src/app/screen/screen.types';
import { cloneDeep } from 'lodash';
import { Smev3TimeSlotsRestServiceStub } from './stubs/smev3-time-slots-rest.service.stub';
import { of } from 'rxjs';
import { LoggerService } from 'projects/epgu-constructor/src/app/core/services/logger/logger.service';
import { LoggerServiceStub } from 'projects/epgu-constructor/src/app/core/services/logger/logger.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { TimeSlotsService } from './time-slots.service';
import * as moment_ from 'moment';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { EMPTY_SLOT, mockEmptySlots, mockSlots } from './mocks/mock-time-slots';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { SmevSlotsResponseInterface } from './time-slots.types';
import { slotsError } from './mocks/mock-time-slots';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { mockWeeks } from './mocks/mock-weeks';
import { HttpClient } from '@angular/common/http';

const moment = moment_;
moment.locale('ru');

describe('TimeSlotsComponent', () => {
  let component: TimeSlotsComponent;
  let fixture: ComponentFixture<TimeSlotsComponent>;
  let screenService: ScreenServiceStub;
  let timeSlotsService: TimeSlotsService;
  let smev3TimeSlotsRestService: Smev3TimeSlotsRestService;
  let datesToolsService: DatesToolsService;
  let store: ScreenStore;
  let httpClient: HttpClient;

  configureTestSuite(() => {
    Date.now = jest.fn().mockReturnValue(new Date('2021-01-01T00:00:00.000Z'));
    TestBed.configureTestingModule({
      imports: [EpguLibModule, HttpClientTestingModule],
      declarations: [
        TimeSlotsComponent,
        MockComponents(
          ScreenPadComponent,
          HelperTextComponent,
          PageNameComponent,
          ScreenContainerComponent,
        ),
      ],
      providers: [
        CurrentAnswersService,
        TimeSlotsConstants,
        DatesToolsService,
        TimeSlotsService,
        UtilsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: Smev3TimeSlotsRestService, useClass: Smev3TimeSlotsRestServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    timeSlotsService = TestBed.inject(TimeSlotsService);
    smev3TimeSlotsRestService = TestBed.inject(Smev3TimeSlotsRestService);
    datesToolsService = TestBed.inject(DatesToolsService);
    httpClient = TestBed.inject(HttpClient);
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    store = cloneDeep(mockScreenDivorceStore);
    screenService.initScreenStore(store);
    fixture = TestBed.createComponent(TimeSlotsComponent);
    component = fixture.componentInstance;

    const compValue = JSON.parse(screenService.component.value);
    let cachedAnswer = screenService.getCompValueFromCachedAnswers();
    if (cachedAnswer) {
      cachedAnswer = JSON.parse(cachedAnswer);
    }
    jest
      .spyOn(timeSlotsService as any, 'getAvailableAreaNames')
      .mockReturnValue(of(['Кабинет отдела', 'Дом музыки']));
    jest
      .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
      .mockReturnValue(of(mockSlots as SmevSlotsResponseInterface));

    jest.spyOn(httpClient, 'get').mockImplementationOnce((url, options) => {
      if (url === 'api/service/actions/currentDateTime') {
        return of('2021-01-01T00:00:00.000Z');
      } else {
        return httpClient.get(url, options);
      }
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('correct format of chosenTimeStr', () => {
    const slot = {
      areaId: 'Кабинет отдела',
      slotId: 'a7164f5b-c5d6-4d47-9478-dcab86882695',
      slotTime: new Date('2021-03-20T10:00:00.000Z'),
      timezone: '00:00Z',
    };
    component['setBookedTimeStr'](slot);
    expect(component.chosenTimeStr).toBe('20 марта 2021 года в 10:00, суббота');
  });

  it('cachedAnswer is not empty', () => {
    fixture.detectChanges();
    const cachedAnswer = component['cachedAnswer'];
    expect(cachedAnswer?.department?.value).toBe('R7700028');
  });

  it('checkDateRestrictions with mock\'s restrictions', () => {
    const checkDateRestrictions = component['checkDateRestrictions'].bind(component);
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

  it('calcing of isBookedDepartment as true', () => {
    fixture.detectChanges();
    let isBookedDepartment = component['timeSlotsService'].isBookedDepartment;
    expect(isBookedDepartment).toBeTruthy();
  });

  it('calcing of isBookedDepartment as false if value changed', () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    department.value = 'temp';
    compValue.department = JSON.stringify(department);
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    let isBookedDepartment = component['timeSlotsService'].isBookedDepartment;
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
    let isBookedDepartment = component['timeSlotsService'].isBookedDepartment;
    expect(isBookedDepartment).toBeFalsy();
  });

  it('generate new uuid in case of waitingTimeExpired', () => {
    const compValue = JSON.parse(screenService.component.value);
    compValue.waitingTimeExpired = true;
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    const oldBookid = component['timeSlotsService'].bookId;
    component['timeSlotsService']['getBookRequest'](EMPTY_SLOT);
    const newBookid = component['timeSlotsService'].bookId;
    expect(oldBookid).not.toMatch(newBookid);
  });

  it('not generate new uuid in case of not waitingTimeExpired', () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    let isBookedDepartment = component['timeSlotsService']?.isBookedDepartment;
    fixture.detectChanges();
    isBookedDepartment = component['timeSlotsService'].isBookedDepartment;
    const oldBookid = component['timeSlotsService'].bookId;
    component['timeSlotsService']['getBookRequest'](EMPTY_SLOT);
    const newBookid = component['timeSlotsService'].bookId;
    expect(oldBookid).toMatch(newBookid);
  });

  it('should send cancel before book in case of waitingTimeExpired', () => {
    const compValue = JSON.parse(screenService.component.value);
    compValue.waitingTimeExpired = true;
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    // @ts-ignore
    const cancelRequestSpy = spyOn(component['timeSlotsService'], 'cancelSlot').and.callThrough();
    component['timeSlotsService']['checkBooking'](EMPTY_SLOT);
    expect(cancelRequestSpy).toBeCalledTimes(1);
  });

  it('bookedSlot should be null if waitingTimeExpired is true', () => {
    const compValue = JSON.parse(screenService.component.value);
    compValue.waitingTimeExpired = true;
    screenService.component.value = JSON.stringify(compValue);
    component['loadTimeSlots']();
    const initMock = spyOn(component['timeSlotsService'], 'init').and.returnValue(of('okay'));
    const hasErrorsMock = spyOn(component['timeSlotsService'], 'hasError').and.returnValue(false);
    const getErrorMessageMock = spyOn(
      component['timeSlotsService'],
      'getErrorMessage',
    ).and.returnValue('no_error');
    fixture.detectChanges();
    const bookedSlot = component.bookedSlot;
    expect(bookedSlot).toBeNull();
  });

  it('MVD should contain caseNumber and empty parentOrderId', () => {
    const compValue = JSON.parse(screenService.component.value);
    const department = JSON.parse(compValue.department);
    compValue.timeSlotType = 'MVD';
    department.attributeValues.AREA_NAME = 'temp';
    compValue.department = JSON.stringify(department);
    screenService.component.value = JSON.stringify(compValue);
    fixture.detectChanges();
    const reqBody = component['timeSlotsService']['getBookRequest'](EMPTY_SLOT);
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
    const actual = [];
    const expected = mockWeeks;
    await component['renderSingleMonthGrid'](actual);
    expect(actual).toEqual(expected);
  });

  describe('when dateType is today', () => {
    beforeEach(() => {
      const todayStr = '2021-02-15T00:00:00.000Z';
      Date.now = jest.fn().mockReturnValue(new Date(todayStr));
      jest.spyOn(httpClient, 'get').mockRestore();
      jest.spyOn(httpClient, 'get').mockImplementationOnce((url, options) => {
        if (url === 'api/service/actions/currentDateTime') {
          return of(todayStr);
        } else {
          return httpClient.get(url, options);
        }
      });
      screenService.component.attrs.dateType = 'today';
      screenService.component.attrs.restrictions = { minDate: [30 + 3, 'd'], maxDate: [1, 'y'] };
    });

    it('should allow book date in 30+3 days after today', async () => {
      component.isDateLocked = jest.fn((date: Date) => component['checkDateRestrictions'](date));
      await fixture.detectChanges();
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

      let lockedDays = fixture.debugElement.queryAll(By.css('.calendar-day.locked'));
      expect(lockedDays.length).toEqual(31);

      fixture.componentInstance.currentArea = {
        id: 'Торжественный (дневное расписание)',
        text: 'Торжественный (дневное расписание)',
      } as ListItem;
      fixture.componentInstance.areaChanged();
      let i = 0;
      fixture.componentInstance.weeks.forEach(week => {
        week.forEach(day => {
          if (day.classes.locked) {
            i++;
          }
        });
      });
      expect(i).toEqual(30);
    });

    it('should draw days equal to daysToShow extended to weeks length', async () => {
      component.isDateLocked = jest.fn((date: Date) => component['checkDateRestrictions'](date));
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
        if (url === 'api/service/actions/currentDateTime') {
          return of(todayStr);
        } else {
          return httpClient.get(url, options);
        }
      });
      screenService.component.attrs.restrictions = { minDate: [30 + 3, 'd'], maxDate: [1, 'y'] };
      component.isDateLocked = jest.fn((date: Date) => component['checkDateRestrictions'](date));
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
    await fixture.detectChanges();
    expect(modalSpy).toBeCalledWith(modalParams);
  });

  it('should not call modal for no slots case and without options', () => {
    const modalSpy = jest.spyOn(component, 'showModal');
    timeSlotsService['slotsMap'] = [];
    fixture.detectChanges();
    expect(modalSpy).not.toBeCalled();
  });

  it('should call error modal if slots request returned error', () => {
    jest
      .spyOn(smev3TimeSlotsRestService, 'getTimeSlots')
      .mockReturnValue(of(slotsError as SmevSlotsResponseInterface));
    const modalSpy = jest.spyOn(component, 'showError');
    fixture.detectChanges();
    expect(modalSpy).toBeCalled();
  });
});
