import { TestBed } from '@angular/core/testing';
import { FormPlayerComponent } from './form-player.component';
import { FormPlayerService } from './services/form-player/form-player.service';
import { UnsubscribeService } from './services/unsubscribe/unsubscribe.service';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ServiceDataService } from './services/service-data/service-data.service';
import { ConfigService } from './config/config.service';
import { ScreenService } from './screen/screen.service';
import { ScreenResolverService } from './services/screen-resolver/screen-resolver.service';
import { FormPlayerApiService } from './services/api/form-player-api/form-player-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApplicantAnswersService } from './shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from './services/component-state/component-state.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// export const epguLibModule = EpguLibModule.forRoot();

describe('FormPlayerComponent', () => {
  let component: FormPlayerComponent;
  let formPlayerService: FormPlayerService;
  // let ModalContainerComponentMock = MockComponent(ModalContainerComponent);
  // let InfoScreenComponentMock = MockComponent(InfoScreenComponent);
  // let InvitationErrorScreenComponentMock = MockComponent(InvitationErrorScreenComponent);
  // let UniqueScreenComponentMock = MockComponent(UniqueScreenComponent);
  // let QuestionsScreenComponentMock = MockComponent(QuestionsScreenComponent);
  // let EmptyScreenComponentMock = MockComponent(EmptyScreenComponent);
  // let CustomScreenComponentMock = MockComponent(CustomScreenComponent);
  // let ComponentScreenComponentMock = MockComponent(ComponentScreenComponent);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // FormPlayerModule,
        // epguLibModule,
        HttpClientTestingModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [
        FormPlayerComponent,
        // ModalContainerComponentMock,
        // InfoScreenComponentMock,
        // InvitationErrorScreenComponentMock,
        // UniqueScreenComponentMock,
        // QuestionsScreenComponentMock,
        // EmptyScreenComponentMock,
        // CustomScreenComponentMock,
        // ComponentScreenComponentMock,
      ],
      providers: [
        ServiceDataService,
        FormPlayerService,
        NavigationService,
        UnsubscribeService,
        ConfigService,
        ScreenService,
        ScreenResolverService,

        FormPlayerApiService,
        ApplicantAnswersService,
        ComponentStateService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(FormPlayerComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(ServiceDataService);
    fixture.debugElement.injector.get(FormPlayerService);
    fixture.debugElement.injector.get(NavigationService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(ConfigService);
    fixture.debugElement.injector.get(ScreenService);
    fixture.debugElement.injector.get(ScreenResolverService);
    formPlayerService = fixture.debugElement.injector.get(FormPlayerService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
