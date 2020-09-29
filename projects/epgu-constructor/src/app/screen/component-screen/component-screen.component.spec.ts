import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { CurrentAnswersService } from '../current-answers.service';
import { ComponentScreenComponent } from './component-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { CycledFieldsService } from '../../services/cycled-fields/cycled-fields.service';


// TODO: Need to refactoring component
xdescribe('ScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;
  let navService: NavigationService;
  let currentAnswersService: CurrentAnswersService;
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
      imports: [ReactiveFormsModule],
      declarations: [ ComponentScreenComponent, ScreenContainerComponent ],
      providers: [
        NavigationService,
        CurrentAnswersService,
        ScreenService,
        UnsubscribeService,
        CachedAnswersService,
        CycledFieldsService,
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
