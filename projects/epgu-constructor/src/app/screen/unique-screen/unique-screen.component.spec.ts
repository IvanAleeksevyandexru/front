import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { UniqueScreenComponent } from './unique-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ApplicantAnswersService } from '../../shared/services/applicant-answers/applicant-answers.service';

describe('UniqueScreenComponent', () => {
  let component: UniqueScreenComponent;
  let fixture: ComponentFixture<UniqueScreenComponent>;
  let navService: NavigationService;
  let screenService: ScreenService;
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
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ UniqueScreenComponent ],
      providers: [NavigationService, ScreenService, UnsubscribeService, ApplicantAnswersService]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
