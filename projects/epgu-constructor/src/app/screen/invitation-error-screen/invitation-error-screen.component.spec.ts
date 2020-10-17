import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ConfigService } from '../../config/config.service';
import { ConfigServiceStub } from '../../config/config.service.stub';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';


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
      terminal: false,
      type: ScreenTypes.COMPONENT
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationErrorScreenComponent, NavigationComponentMock, InvitationErrorComponentMock ],
      providers: [
        NavigationService,
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
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
