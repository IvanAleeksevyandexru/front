import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ButtonComponent, LoaderComponent } from 'epgu-lib';

import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';
import { TimerPipe } from '../pipes/timer.pipe';
import { ConfirmMarriageComponent } from './confirm-marriage.component';
import { TimerComponent } from './timer/timer.component';
import { ScreenService } from '../../../../screen.service';

describe('TimerComponent', () => {
  let component: ConfirmMarriageComponent;
  let fixture: ComponentFixture<ConfirmMarriageComponent>;
  let navigationService: NavigationService;

  const timer = {
    time: 123456,
    completion: 200000,
    center: 50,
    circumference: 4564,
    finish: 200000,
    offset: 123,
    progress: 45,
    radius: 100,
    size: 100,
    start: 123,
    strokeWidth: 3,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ConfirmMarriageComponent,
        ButtonComponent,
        TimerComponent,
        TimerPipe,
        ScreenContainerComponent,
        PageNameComponent,
        ScreenPadComponent,
        NavigationComponent,
        LoaderComponent,
        ScreenService,
      ],
      providers: [UnsubscribeService, NavigationService],
    }).compileComponents();

    navigationService = TestBed.inject(NavigationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMarriageComponent);
    component = fixture.componentInstance;
    component.timer = timer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
