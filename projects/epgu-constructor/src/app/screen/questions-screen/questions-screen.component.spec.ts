import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { PageNameComponent } from '../../shared/components/base/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { QuestionsScreenComponent } from './questions-screen.component';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { ApplicantAnswersService } from '../../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('QuestionsScreenComponent', () => {
  let component: QuestionsScreenComponent;
  let fixture: ComponentFixture<QuestionsScreenComponent>;
  let navService: NavigationService;
  let screenService: ScreenService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  const screenDataMock: ScreenStore = {
    display: {
      components: [
        {
          attrs: {},
          id: 'sd',
          label: '',
          type: '',
          visited: true,
          value: ''
        }
      ],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: ScreenTypes.QUESTION
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [
        QuestionsScreenComponent,
        PageNameComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        NavigationComponentMock,
        ButtonComponent
      ],
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
    fixture = TestBed.createComponent(QuestionsScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
