import { TestBed } from '@angular/core/testing';

import { SuggestMonitorService } from '../suggest-monitor/suggest-monitor.service';
import { HealthService } from '@epgu/epgu-constructor/src/lib/core/services/health/health.service';
import { ScreenService } from '../../../screen/screen.service';
import { HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { SuggestActions } from '../../constants/suggest';

const DTO = {
  serviceCode: '10000000101',
  display: {
    id: 'scrchld2',
  },
};
const SOURCE = 'DADATA_WIDGET';
const DATE = new Date().toISOString();

describe('SuggestMonitorService', () => {
  let health: HealthService;
  let screen: ScreenServiceStub;
  let monitor: SuggestMonitorService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestMonitorService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
      ],
    });
    Object.defineProperty(window.document, 'cookie', {
      writable: true,
      value: 'u=123456',
    });
    health = TestBed.inject(HealthService);
    screen = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    monitor = TestBed.inject(SuggestMonitorService);
  });

  describe('handleAutocompleteEvent', () => {
    it('should be called with specific params', () => {
      spyOn(health, 'measureStart').and.callThrough();
      spyOn(health, 'measureEnd').and.callThrough();
      screen.screenStore = DTO as any;
      monitor.handleAutocompleteEvent(SuggestActions.REUSE_ACTION, SOURCE, {
        date: DATE,
      });
      expect(health.measureStart).toHaveBeenCalledWith(SuggestActions.REUSE_ACTION);
      expect(health.measureEnd).toHaveBeenCalledWith(SuggestActions.REUSE_ACTION, 0, {
        suggestField: `10000000101_scrchld2_${SOURCE}`,
        date: DATE,
        userId: '123456',
      });
    });
  });
});
