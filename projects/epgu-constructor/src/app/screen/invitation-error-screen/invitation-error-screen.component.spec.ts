import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { MockComponent } from 'ng-mocks';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { ScreenService } from '../screen.service';
import { ScreenData } from '../screen.types';
import { SCREEN_TYPE } from '../../../constant/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';

describe('InvitationScreenComponent', () => {
  let component: InvitationErrorScreenComponent;
  let fixture: ComponentFixture<InvitationErrorScreenComponent>;
  let navService: NavigationService;
  let screenService: ScreenService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  let InvitationErrorComponentMock = MockComponent(InvitationErrorComponent);
  const screenDataMock: ScreenData = {
    componentData: {
      components: [
        {
          attrs: {},
          type: '',
          id: '',
          label: '',
          value: ''
        }
      ],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: SCREEN_TYPE.COMPONENT
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationErrorScreenComponent, NavigationComponentMock, InvitationErrorComponentMock ],
      providers: [
        NavigationService,
        ScreenService,
        UnsubscribeService
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenData(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
