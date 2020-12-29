import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerComponent } from './timer.component';
import { TimerPipe } from './pipes/timer.pipe';
import { MockModule } from 'ng-mocks';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { ValueLoaderService } from '../../../../shared/services/value-loader/value-loader.service';
import { BaseModule } from '../../../../shared/base.module';
import { CoreModule } from '../../../../core/core.module';

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
        ValueLoaderService,
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
