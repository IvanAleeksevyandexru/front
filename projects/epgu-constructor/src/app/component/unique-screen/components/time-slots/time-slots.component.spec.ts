import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule, ListItem } from 'epgu-lib';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { HelperTextComponent } from '../../../../shared/components/base-components/helper-text/helper-text.component';
import { ScreenPadComponent } from '../../../../shared/components/screen-pad/screen-pad.component';
import { TimeSlotsComponent } from './time-slots.component';
import { MockComponents } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary/dictionary-api.service.stub';
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
import { EventBusService } from 'projects/epgu-constructor/src/app/core/services/event-bus/event-bus.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { TimeSlotsService } from './time-slots.service';
import * as moment_ from 'moment';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { EMPTY_SLOT } from './mocks/mock-time-slots';

const moment = moment_;
moment.locale('ru');

Date.now = jest.fn().mockReturnValue(new Date('2020-01-01T00:00:00.000Z'));

describe('TimeSlotsComponent', () => {
  let component: TimeSlotsComponent;
  let fixture: ComponentFixture<TimeSlotsComponent>;
  let screenService: ScreenServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpguLibModule],
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
        EventBusService,
        DatesToolsService,
        TimeSlotsService,
        UtilsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: Smev3TimeSlotsRestService, useClass: Smev3TimeSlotsRestServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    const store = cloneDeep(mockScreenDivorceStore);
    screenService.initScreenStore((store as unknown) as ScreenStore);
    fixture = TestBed.createComponent(TimeSlotsComponent);
    component = fixture.componentInstance;
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
    expect(check).toBeFalsy();
    date = new Date('2021-01-01T10:00:00.000Z');
    check = checkDateRestrictions(date);
    expect(check).toBeTruthy();
    date = new Date('2020-12-31T10:00:00.000Z');
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

  it('renderSingleMonthGrid works as before', () => {
    component.activeYearNumber = new Date(Date.now()).getUTCFullYear();
    component.activeMonthNumber = new Date(Date.now()).getUTCMonth();

    const renderSingleMonthGrid = (output): void => {
      output.splice(0, output.length); // in-place clear
      const firstDayOfMonth = moment()
        .year(component.activeYearNumber)
        .month(component.activeMonthNumber)
        .startOf('month')
        .startOf('day');
      const firstDayOfWeekInMonth = firstDayOfMonth.isoWeekday();
      const daysInMonth = firstDayOfMonth.daysInMonth();
      let week = 0;
      output.push([]);
      if (firstDayOfWeekInMonth > 1) {
        for (let i = 1; i < firstDayOfWeekInMonth; i += 1) {
          const date = moment(firstDayOfMonth).add(i - firstDayOfWeekInMonth, 'day');
          output[0].push({ number: date.date(), date: date.toDate() });
        }
      }
      for (let i = 0; i < daysInMonth; i += 1) {
        if (output[week].length && output[week].length % 7 === 0) {
          week += 1;
          output.push([]);
        }
        const date = moment(firstDayOfMonth).add(i, 'day');
        output[week].push({ number: date.date(), date: date.toDate() });
      }
      let days = 0;
      while (output[week].length < 7) {
        const date = moment(firstDayOfMonth).add(1, 'month').add(days, 'day');
        days += 1;
        output[week].push({ number: date.date(), date: date.toDate() });
      }
    };

    const actual = [];
    component['renderSingleMonthGrid'](actual);

    const expected = [];
    renderSingleMonthGrid(expected);

    expect(actual).toEqual(expected);
  });

  it('checkDateRestrictions works as before', () => {
    const checkDateRestrictions = (
      date: Date,
      startType: moment_.unitOfTime.StartOf = 'day',
    ): boolean => {
      let isInvalid = false;
      const today = moment().startOf(startType);
      const restrictions = screenService.component.attrs.restrictions;
      const checks = {
        minDate: (amount, type): boolean =>
          moment(date).isBefore(today.clone().add(amount, type).startOf(startType)),
        maxDate: (amount, type): boolean =>
          moment(date).isAfter(today.clone().add(amount, type).startOf(startType)),
      };
      Object.keys(restrictions).some((key) => {
        const [amount, type] = restrictions[key];
        isInvalid = checks[key](amount, type);
        return isInvalid;
      });
      return isInvalid;
    };

    screenService.component.attrs.restrictions = { minDate: [30, 'd'], maxDate: [1, 'y'] };
    const date = new Date(Date.now());

    for (let i = -30; i < 30; ++i) {
      date.setDate(date.getDate() + 1);
      ['day', 'month'].forEach((unit) => {
        expect(component['checkDateRestrictions'](date, unit as any)).toEqual(
          checkDateRestrictions(date, unit as any),
        );
      });
    }

    [
      '2020-01-01T10:00:00.000Z',
      '2020-02-01T10:00:00.000Z',
      '2021-01-01T10:00:00.000Z',
      '2020-12-31T10:00:00.000Z',
    ].forEach((dateStr) => {
      const date = new Date(dateStr);
      ['day', 'month'].forEach((unit) => {
        expect(component['checkDateRestrictions'](date, unit as any)).toBe(
          checkDateRestrictions(date, unit as any),
        );
      });
    });
  });

  describe('when dateType is today', () => {
    beforeEach(() => {
      screenService.component.attrs.dateType = 'today';
      screenService.component.attrs.restrictions = { minDate: [30 + 3, 'd'], maxDate: [1, 'y'] };
      component.isDateLocked = jest.fn((date: Date) => component['checkDateRestrictions'](date));

      const today = new Date(Date.now());
      const nextMonth = today.getMonth() === 11 ? '01' : `0${(today.getMonth() + 2)}`.substr(-2);
      const year = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
      const selectedMonth = new ListItem({ id: `${year}-${nextMonth}` } as ListItem);
      component.monthChanged(selectedMonth);
      fixture.detectChanges();
    });

    it('should allow book date in 30+3 days after today', () => {
      const allDays = fixture.debugElement.queryAll(By.css('.calendar-day'));
      expect(allDays.length).toEqual(35);

      const lockedDays = fixture.debugElement.queryAll(By.css('.calendar-day.locked'));
      expect(lockedDays.length).toEqual(7);
    });
  });

  describe('when dateType is refDate', () => {
    beforeEach(() => {
      screenService.component.attrs.dateType = 'refDate';
      screenService.component.attrs.refDate = '2019-12-15T00:00:00.000Z';
      screenService.component.attrs.restrictions = { minDate: [30 + 3, 'd'], maxDate: [1, 'y'] };
      component.isDateLocked = jest.fn((date: Date) => component['checkDateRestrictions'](date));
      component.monthChanged(new ListItem({ id: '2020-01' } as ListItem));
      fixture.detectChanges();
    });

    it('should allow book date in 30+3 days after today', () => {
      const allDays = fixture.debugElement.queryAll(By.css('.calendar-day'));
      expect(allDays.length).toEqual(35);

      const lockedDays = fixture.debugElement.queryAll(By.css('.calendar-day.locked'));
      expect(lockedDays.length).toEqual(18);
    });
  });
});
