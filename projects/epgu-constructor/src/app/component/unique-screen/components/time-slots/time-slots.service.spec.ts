import { TestBed } from '@angular/core/testing';
import { EpguLibModule } from '@epgu/epgu-lib';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { TimeSlotsConstants, TimeSlotsTypes } from './time-slots.constants';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ScreenStore } from 'projects/epgu-constructor/src/app/screen/screen.types';
import { cloneDeep } from 'lodash';
import { Smev3TimeSlotsRestServiceStub } from './stubs/smev3-time-slots-rest.service.stub';
import { LoggerService } from 'projects/epgu-constructor/src/app/core/services/logger/logger.service';
import { LoggerServiceStub } from 'projects/epgu-constructor/src/app/core/services/logger/logger.service.stub';
import { EventBusService } from 'projects/epgu-constructor/src/app/core/services/event-bus/event-bus.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { TimeSlotsService } from './time-slots.service';
import * as moment_ from 'moment';
import { mockScreenMvdStore } from './mocks/mock-screen-mvd-store';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { configureTestSuite } from 'ng-bullet';

describe('TimeSlotsComponent', () => {
  let screenService: ScreenServiceStub;
  let timeSlotsService: TimeSlotsService;
  let compValue;
  let cachedAnswer;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [EpguLibModule],
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
    timeSlotsService = TestBed.inject(TimeSlotsService);
    const store: ScreenStore = cloneDeep(mockScreenMvdStore);
    screenService.initScreenStore((store as unknown) as ScreenStore);
    const component = screenService.component;
    compValue = JSON.parse(component.value);
    cachedAnswer = screenService.getCompValueFromCachedAnswers();
    if (cachedAnswer) {
      cachedAnswer = JSON.parse(cachedAnswer);
    }
    timeSlotsService.changed(compValue, cachedAnswer);
  });

  it('MVD should take organizationId from calculated organizationId component\'s value ', () => {
    const organizationId = timeSlotsService['getSlotsRequestOrganizationId'](TimeSlotsTypes.MVD);
    expect(organizationId).toBe('123');
  });

  it('MVD should take organizationId from department.value', () => {
    const newCompValue = cloneDeep(compValue);
    delete newCompValue.organizationId;
    timeSlotsService.changed(newCompValue, cachedAnswer);
    const organizationId = timeSlotsService['getSlotsRequestOrganizationId'](TimeSlotsTypes.MVD);
    expect(organizationId).toBe('9277');
  });
});
