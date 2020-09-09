import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { MockComponent } from 'ng-mocks';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ApplicantAnswersService } from '../../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';

describe('InvitationScreenComponent', () => {
  let component: InvitationErrorScreenComponent;
  let fixture: ComponentFixture<InvitationErrorScreenComponent>;
  let navService: NavigationService;
  let screenService: ScreenService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  let InvitationErrorComponentMock = MockComponent(InvitationErrorComponent);
  const screenDataMock: ScreenStore = {
    display: {
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
      type: ScreenTypes.COMPONENT
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationErrorScreenComponent, NavigationComponentMock, InvitationErrorComponentMock ],
      providers: [
        NavigationService,
        ScreenService,
        UnsubscribeService,
        ApplicantAnswersService,
        ComponentStateService
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationErrorScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
