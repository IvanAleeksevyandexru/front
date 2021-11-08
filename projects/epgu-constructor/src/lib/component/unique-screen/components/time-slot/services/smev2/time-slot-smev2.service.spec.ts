import { TestBed } from '@angular/core/testing';
import { TimeSlotSmev2Service } from './time-slot-smev2.service';
import { TimeSlotStateService } from '../state/time-slot-state.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { Smev2RestApiService } from '../api/smev2/smev2-rest-api.service';
import { JsonHelperService } from '../../../../../../core/services/json-helper/json-helper.service';
import {
  ConfigService,
  ConfigServiceStub,
  DATE_ISO_STRING_FORMAT,
  DatesToolsService,
  DatesToolsServiceStub,
  SessionService,
} from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotStateServiceStub } from '../state/time-slot-state.service.stub';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { DictionaryToolsServiceStub } from '../../../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { Smev2RestApiServiceStub } from '../api/smev2/smev2-rest-api.service.stub';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { Slot } from '../../typings';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const createMockSlot = (id: string, date: string) =>
  ({
    slotId: id,
    timezone: '+3',
    slotTime: new Date(date),
  } as Slot);

describe('TimeSlotSmev2Service', () => {
  let service: TimeSlotSmev2Service;
  let sessionService: SessionService;
  let dateService: DatesToolsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: TimeSlotStateService, useClass: TimeSlotStateServiceStub },
        JsonHelperService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: Smev2RestApiService, useClass: Smev2RestApiServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        SessionService,
        TimeSlotSmev2Service,
      ],
    });
    service = TestBed.inject(TimeSlotSmev2Service);
    dateService = TestBed.inject(DatesToolsService);

    sessionService = TestBed.inject(SessionService);
  });
  describe('base', () => {
    const cacheItem = ({
      value: '2012-12-12',
    } as unknown) as DictionaryItem;

    it('should be addToCache', () => {
      service.addToCache('id', cacheItem);
      expect(service['cache']['id']).toBe(cacheItem);
    });

    it('should be createSlot', () => {
      jest.spyOn(service, 'addToCache');
      service.createSlot(cacheItem);
      expect(service.addToCache).toHaveBeenCalled();
    });

    it('should be resetCache', () => {
      service.addToCache('id', cacheItem);
      service.resetCache();
      expect(service['cache']).toEqual({});
    });

    it('should be getCacheBySlot', () => {
      service.addToCache('id', cacheItem);
      expect(service.getCacheBySlot(createMockSlot('id', '2012-12-12'))).toBe(cacheItem);
    });
    it('should be getOptions', () => {
      jest.spyOn(sessionService, 'userId', 'get').mockReturnValue('1');

      jest.spyOn(dateService, 'sub').mockReturnValue(new Date('2012-12-13T03:59:59.000'));
      const result = service.getOptions(new Date('2012-12-12'));

      expect(result).toEqual({
        treeFiltering: 'ONELEVEL',
        pageNum: 1,
        pageSize: '258',
        filter: {
          union: {
            unionKind: 'AND',
            subs: [
              {
                simple: {
                  attributeName: 'AppointmentDate',
                  condition: DictionaryConditions.EQUALS,
                  value: {
                    asString: new Date('2012-12-12'),
                  },
                },
              },
              {
                simple: {
                  attributeName: 'AppointmentDateTo',
                  condition: DictionaryConditions.EQUALS,
                  value: {
                    asString: new Date('2012-12-13T03:59:59.000'),
                  },
                },
              },
              {
                simple: {
                  attributeName: 'personSourceSystemID',
                  condition: DictionaryConditions.EQUALS,
                  value: {
                    asString: '1',
                  },
                },
              },
            ],
          },
        },
        parentRefItemValue: '',
        selectAttributes: ['*'],
        tx: '',
      });
    });
  });
});
