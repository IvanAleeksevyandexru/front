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
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../services/date-range/date-range.service';


describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  const timer = {
    isWarning: false,
    isFinish: false,
    time: 123456,
    start: 123,
    finish: 200000,
  };

  beforeEach(() => {
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
      ],
      imports: [MockModule(BaseModule), MockModule(CoreModule)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    component.timer = timer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
