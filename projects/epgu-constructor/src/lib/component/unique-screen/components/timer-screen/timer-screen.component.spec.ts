import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import {
  ConfigService,
  ConfigServiceStub,
  CoreUiModule,
  LoggerService,
  LoggerServiceStub,
  ScreenPadComponent,
  DatesToolsService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { TimerScreenComponent } from './timer-screen.component';
import { TimerComponentBase } from '../../../../shared/components/timer/timer.interface';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DefaultUniqueScreenWrapperComponent } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { TimerModule } from '../../../../shared/components/timer/timer.module';

import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';

const mockData: TimerComponentBase = {
  id: null,
  type: null,
  attrs: {
    startTime: '',
    currentTime: '',
    expirationTime: '',
    timerRules: {},
    refs: {
      timeStartRef: '',
      timeFinishRef: '',
      visitTimeRef: '',
    },
  },
};

describe('TimerScreenComponent', () => {
  let component: TimerScreenComponent;
  let fixture: ComponentFixture<TimerScreenComponent>;
  let currentAnswersService: CurrentAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimerScreenComponent,
        MockComponent(DefaultUniqueScreenWrapperComponent),
        MockComponent(ScreenPadComponent),
      ],
      imports: [RouterTestingModule, TimerModule, MockModule(CoreUiModule)],
      providers: [
        CurrentAnswersService,
        DatesToolsService,
        RefRelationService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerScreenComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
