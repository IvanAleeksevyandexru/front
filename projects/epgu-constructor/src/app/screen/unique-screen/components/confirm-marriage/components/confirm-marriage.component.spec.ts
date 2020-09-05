import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from 'epgu-lib';

import { ConfirmMarriageComponent } from './confirm-marriage.component';
import { SCREEN_TYPE } from '../../../../../../constant/global';
import { UnsubscribeService } from '../../../../../services/unsubscribe/unsubscribe.service';
import { TimerComponent } from './timer/timer.component';
import { TimerPipe } from '../pipes/timer.pipe';
import { ScreenContainerComponent } from '../../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../../shared/components/page-name/page-name.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { NavigationService } from '../../../../../shared/services/navigation/navigation.service';
import { DisplayInterface } from '../../../../../services/api/form-player-api/form-player-api.types';

describe('TimerComponent', () => {
  let component: ConfirmMarriageComponent;
  let fixture: ComponentFixture<ConfirmMarriageComponent>;
  let navigationService: NavigationService;

  const displayDataMock: DisplayInterface = {
    components: [
      {
        id: 'pd9',
        type: 'ConfirmMarriage',
        label: 'На оплату пошлины для подтверждения бронирования осталось:',
        attrs: {
          ceremonyType: { label: 'Место регистрации:', type: 'ref', value: '' },
          place: { label: 'Место регистрации:', type: 'ref', value: '' },
          address: { label: 'Адрес места регистрации:', type: 'ref', value: '' },
          time: { label: 'Выбранное время:', type: 'ref', value: '' },
          timer: {
            start: { type: 'ref', value: '' },
            finish: { type: 'ref', value: '' },
          },
        },
        value: '',
      },
    ],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: SCREEN_TYPE.UNIQUE,
  };

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
      declarations: [
        ConfirmMarriageComponent,
        ButtonComponent,
        TimerComponent,
        TimerPipe,
        ScreenContainerComponent,
        PageNameComponent,
        ScreenPadComponent,
        NavigationComponent,
      ],
      providers: [UnsubscribeService, NavigationService],
    }).compileComponents();

    navigationService = TestBed.inject(NavigationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMarriageComponent);
    component = fixture.componentInstance;
    component.timer = timer;
    component.data = displayDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
