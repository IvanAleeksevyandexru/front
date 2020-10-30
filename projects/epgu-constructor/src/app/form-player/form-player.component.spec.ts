import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule, LoadService } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { LoadServiceStub } from '../core/config/load-service-stub';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerModule } from './form-player.module';
import { ComponentScreenComponent } from '../screen/component-screen/component-screen.component';
import { CustomScreenComponent } from '../screen/custom-screen/custom-screen.component';
import { EmptyScreenComponent } from '../screen/empty-screen/empty-screen.component';
import { InfoScreenComponent } from '../screen/info-screen/info-screen.component';
import { InvitationErrorScreenComponent } from '../screen/invitation-error-screen/invitation-error-screen.component';
import { QuestionsScreenComponent } from '../screen/questions-screen/questions-screen.component';
import { UniqueScreenComponent } from '../screen/unique-screen/unique-screen.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { FormPlayerServiceStub } from './services/form-player/form-player.service.stub';
import { UnsubscribeService } from '../core/services/unsubscribe/unsubscribe.service';
import { ModalContainerComponent } from '../modal/components/modal-container/modal-container.component';
import { NavigationService } from '../core/services/navigation/navigation.service';
import { ComponentsListComponent } from '../component/components-list/components-list.component';

export const epguLibModule = EpguLibModule.forRoot();

xdescribe('FormPlayerComponent', () => {
  let formPlayerService: FormPlayerService;
  let ModalContainerComponentMock = MockComponent(ModalContainerComponent);
  let InfoScreenComponentMock = MockComponent(InfoScreenComponent);
  let InvitationErrorScreenComponentMock = MockComponent(InvitationErrorScreenComponent);
  let UniqueScreenComponentMock = MockComponent(UniqueScreenComponent);
  let QuestionsScreenComponentMock = MockComponent(QuestionsScreenComponent);
  let EmptyScreenComponentMock = MockComponent(EmptyScreenComponent);
  let CustomScreenComponentMock = MockComponent(CustomScreenComponent);
  let ComponentScreenComponentMock = MockComponent(ComponentScreenComponent);
  let ComponentsListComponentMock = MockComponent(ComponentsListComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormPlayerModule,
        RouterTestingModule,
        epguLibModule,
      ],
      declarations: [
        ModalContainerComponentMock,
        InfoScreenComponentMock,
        InvitationErrorScreenComponentMock,
        UniqueScreenComponentMock,
        QuestionsScreenComponentMock,
        EmptyScreenComponentMock,
        CustomScreenComponentMock,
        ComponentScreenComponentMock,
        ComponentsListComponentMock,
      ],
      providers: [
        NavigationService,
        UnsubscribeService,
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: LoadService, useClass: LoadServiceStub },
      ]
    }).compileComponents();
    formPlayerService = TestBed.inject(FormPlayerService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FormPlayerComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
