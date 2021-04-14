import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { DictionaryToolsService } from '../../services/dictionary/dictionary-tools.service';
import { CoreModule } from '../../../core/core.module';
import { ConfigService } from '../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { BaseModule } from '../../base.module';
import { CachedAnswersService } from '../../services/cached-answers/cached-answers.service';
import { PrepareComponentsService } from '../../services/prepare-components/prepare-components.service';
import { TimerPipe } from './pipes/timer.pipe';
import { TimerComponent } from './timer.component';
import { DictionaryApiService } from '../../services/dictionary/dictionary-api.service';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../services/date-range/date-range.service';
import { RefRelationService } from '../../services/ref-relation/ref-relation.service';
import { TimerComponentBase } from './timer.interface';
import { configureTestSuite } from 'ng-bullet';

const someDate = '2020-01-01T00:00:00.000Z';
const millisecondsOfSomeDate = new Date(someDate).getTime();
Date.now = jest.fn().mockReturnValue(millisecondsOfSomeDate);

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  let startTime = millisecondsOfSomeDate;
  let currentTime = millisecondsOfSomeDate + 2000;
  let expirationTime = millisecondsOfSomeDate + 10000;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [TimerComponent, TimerPipe],
      providers: [
        UnsubscribeService,
        ScreenService,
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        CachedAnswersService,
        PrepareComponentsService,
        EventBusService,
        DatesToolsService,
        DictionaryToolsService,
        DictionaryApiService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
      ],
      imports: [MockModule(BaseModule), MockModule(CoreModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    component.data = {
      attrs: { startTime, currentTime, expirationTime }
    } as any as TimerComponentBase;
    fixture.detectChanges();
  });

  it('should support serverTime', () => {
    expect(component.timer.time).toBe(expirationTime - currentTime);
  });

  describe('when serverTime not provided', () => {
    const savedCurrentTime = currentTime;
    beforeAll(() => {
      currentTime = undefined;
    });

    afterAll(() => {
      currentTime = savedCurrentTime;
    });

    it('should use local time', () => {
      expect(component.timer.time).toBe(expirationTime - millisecondsOfSomeDate);
    });
  });

  it('should use serverTime', () => {
    expect(component.timer.time).toBe(expirationTime - currentTime);
  });
});
