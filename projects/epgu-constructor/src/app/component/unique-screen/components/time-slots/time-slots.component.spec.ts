import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { HelperTextComponent } from '../../../../shared/components/base-components/helper-text/helper-text.component';
import { ScreenPadComponent } from '../../../../shared/components/screen-pad/screen-pad.component';
import { TimeSlotsComponent } from './time-slots.component';
import { MockComponents } from 'ng-mocks';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary-api/dictionary-api.service.stub';
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

Date.now = jest.fn().mockReturnValue(new Date('2020-01-01T00:00:00.000Z'));

describe('TimeSlotsComponent', () => {
  let component: TimeSlotsComponent;
  let fixture: ComponentFixture<TimeSlotsComponent>;
  let screenService: ScreenServiceStub;
  const EMPTY_SLOT = {
    slotId: '',
    slotTime: new Date(),
    timezone: '',
  };

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
    screenService = TestBed.inject(ScreenService) as unknown as ScreenServiceStub;
    const store = cloneDeep(mockScreenDivorceStore);
    screenService.initScreenStore(store as unknown as ScreenStore);
    fixture = TestBed.createComponent(TimeSlotsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('corrent format of chosenTimeStr', () => {
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
    const getErrorMessageMock = spyOn(component['timeSlotsService'], 'getErrorMessage').and.returnValue('no_error');
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

});
