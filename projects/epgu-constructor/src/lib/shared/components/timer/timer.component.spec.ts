import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DatesToolsServiceStub,
  CoreUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { CoreModule } from '../../../core/core.module';

import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { BaseModule } from '../../base.module';
import { CachedAnswersService } from '../../services/cached-answers/cached-answers.service';
import { PrepareComponentsService } from '../../services/prepare-components/prepare-components.service';
import { TimerPipe } from './pipes/timer.pipe';
import { TimerComponent } from './timer.component';
import { TimerComponentBase } from './timer.interface';
import { DateRestrictionsService } from '../../services/date-restrictions/date-restrictions.service';

const someDate = '2020-01-01T00:00:00.000Z';
const millisecondsOfSomeDate = new Date(someDate).getTime();

describe('TimerComponent', () => {
  let component: TimerComponent;
  let datesToolsService: DatesToolsService;
  let fixture: ComponentFixture<TimerComponent>;
  const startTime = millisecondsOfSomeDate;
  let currentTime = millisecondsOfSomeDate + 2000;
  const expirationTime = millisecondsOfSomeDate + 10000;
  const attrsFromTimeAsc = {
    attrs: {
      timerRules: {
        warningColorFromTime: 120,
        hideTimerFrom: 1,
        labels: [
          {
            label: 'a',
            fromTime: 1,
          },
          {
            label: 'b',
            fromTime: 100,
          },
        ],
      },
    },
  };
  const attrsFromTimeDesc = {
    attrs: {
      timerRules: {
        warningColorFromTime: 120,
        hideTimerFrom: 1,
        labels: [
          {
            label: 'a',
            fromTime: 100,
          },
          {
            label: 'b',
            fromTime: 1,
          },
        ],
      },
    },
  };
  const attrsFromTimeEqual = {
    attrs: {
      timerRules: {
        warningColorFromTime: 120,
        hideTimerFrom: 1,
        labels: [
          {
            label: 'a',
            fromTime: 100,
          },
          {
            label: 'b',
            fromTime: 100,
          },
        ],
      },
    },
  };
  const attrsActions = {
    attrs: {
      timerRules: {
        actions: [
          {
            toTime: 1,
            fromTime: 10,
          },
        ],
      },
    },
  };
  const mockDataFullActions: ComponentDto = {
    id: 'booktimer1',
    required: true,
    type: 'Timer',
    label: '?????? ???????????????? ???????????????? ????????????????',
    attrs: {
      timerRules: {
        warningColorFromTime: 120,
        hideTimerFrom: 1,
        actions: [
          {
            label: '?????????????? ?? ???????????? ??????????????',
            value: '?????????????? ?? ???????????? ??????????????',
            color: 'white',
            type: 'redirectToLK',
            action: 'getNextScreen',
            toTime: 0,
            fromTime: 0,
          },
          {
            label: '?????????????????????????? ???????????? ??????????',
            value: '?????????????????????????? ???????????? ??????????',
            color: 'white',
            type: 'prevStep',
            action: 'getPrevStep',
            toTime: 0,
            fromTime: 14400,
          },
        ],
        labels: [
          {
            label: '???? ???? ????????????',
            fromTime: 0,
          },
        ],
      },
    },
  };
  const mockData: ComponentDto = {
    id: 'booktimer1',
    required: true,
    type: 'Timer',
    label: '?????? ???????????????? ???????????????? ????????????????',
    attrs: {
      timerRules: {
        warningColorFromTime: 120,
        hideTimerFrom: 1,
        actions: [
          {
            label: '?????????????? ?? ???????????? ??????????????',
            value: '?????????????? ?? ???????????? ??????????????',
            color: 'white',
            type: 'redirectToLK',
            action: 'getNextScreen',
          },
        ],
        labels: [
          {
            label: '???? ???? ????????????',
            fromTime: 20,
          },
        ],
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent, TimerPipe],
      providers: [
        MockProvider(ScreenService),
        MockProvider(CurrentAnswersService),
        MockProvider(CachedAnswersService),
        MockProvider(PrepareComponentsService),
        MockProvider(DateRestrictionsService),
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
      ],
      imports: [MockModule(BaseModule), MockModule(CoreModule), MockModule(CoreUiModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    component.data = ({
      attrs: { startTime, currentTime, expirationTime },
    } as any) as TimerComponentBase;
    datesToolsService = TestBed.inject(DatesToolsService);
    jest.spyOn(datesToolsService, 'getToday').mockReturnValue(Promise.resolve(new Date(someDate)));

    fixture.detectChanges();
  });

  it('should support serverTime', () => {
    expect(component.timer.time).toBe(expirationTime - currentTime);
  });

  describe('when serverTime not provided', () => {
    it('should use local time', async () => {
      component.data = ({
        attrs: { startTime, expirationTime },
      } as any) as TimerComponentBase;
      await fixture.whenStable();

      expect(component.timer.time).toBe(expirationTime - millisecondsOfSomeDate);
    });
  });

  it('should use serverTime', () => {
    expect(component.timer.time).toBe(expirationTime - currentTime);
  });

  describe('startTimerHandler', () => {
    it('should isFinish be falsy if time less one sec', () => {
      component.timer = { time: 100 };
      component.startTimerHandler();
      expect(component.timer.isFinish).toBeTruthy();
    });

    it('should reduce time for one sec if time  > 0', () => {
      component.timer = { time: 5000 };
      component.startTimerHandler();
      expect(component.timer.time).toBe(4000);
    });

    it('should isWarning false if attrs undefined', () => {
      component.data.attrs = undefined;
      component.startTimerHandler();
      expect(component.timer.isWarning).toBeFalsy();
    });

    describe('setLabelFromRule', () => {
      it('should label equal attrs.label if timer', () => {
        component.timer = { time: 10 };
        component.data = mockData;
        component.startTimerHandler();
        expect(component.label).toEqual(mockData.attrs.timerRules.labels[0].label);
      });

      it('should label equal attrs.label if timer finish', async () => {
        component.data = mockDataFullActions;
        await fixture.whenStable();
        component.startTimerHandler();
        component.timer = { isFinish: true };
        expect(component.label).toEqual(mockDataFullActions.attrs.timerRules.labels[0].label);
      });

      it('should label be if isFinish false', () => {
        component.data = mockDataFullActions;
        component.timer = { isFinish: false };
        component.startTimerHandler();
        expect(component.label).not.toBeNull();
      });
    });

    describe('setButtonFromRule', () => {
      it('should actionsButtons equal attrs.actions if fromTime > time > toTime', () => {
        component.data = attrsActions;
        component.timer = { time: 5000 };
        component.startTimerHandler();
        expect(component.actionButtons).toEqual(attrsActions.attrs.timerRules.actions);
      });
    });

    describe('checkHideTimer', () => {
      it('should showTimer be false if timer finish', async () => {
        component.data = {
          attrs: {
            timerRules: {
              hideTimerFrom: false,
            },
          },
        };
        await fixture.whenStable();
        component.startTimerHandler();
        component.timer = { isFinish: true };
        expect(component.showTimer).toBeFalsy();
      });
    });
  });

  describe('sortLabelsByTime', () => {
    it('should sort labels by asc', async () => {
      component.data = attrsFromTimeDesc;
      await fixture.whenStable();
      let { labels } = component.data.attrs.timerRules;
      expect(labels[0].label).toEqual('a');
      component.data = attrsFromTimeEqual;
      await fixture.whenStable();
      labels = component.data.attrs.timerRules.labels;
      expect(labels[0].label).toEqual('a');
    });

    it('should sort labels by desc', async () => {
      component.data = attrsFromTimeAsc;
      await fixture.whenStable();
      const { labels } = component.data.attrs.timerRules;
      expect(labels[1].label).toEqual('a');
    });
  });
});
