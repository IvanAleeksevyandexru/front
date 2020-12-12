import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerComponent } from './timer.component';
import { TimerPipe } from './pipes/timer.pipe';
import { MockModule } from 'ng-mocks';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ConfigService } from '../../../../core/config/config.service';
import { ConfigServiceStub } from '../../../../core/config/config.service.stub';
import { CoreModule } from '../../../../core/core.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { CachedAnswersService } from '../../../../shared/services/applicant-answers/cached-answers.service';

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
      declarations: [TimerComponent, TimerPipe, ActionDirective],
      providers: [
        UnsubscribeService,
        ScreenService,
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        CachedAnswersService,
      ],
      imports: [MockModule(CoreModule), MockModule(SharedModule)],
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
