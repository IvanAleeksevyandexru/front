import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonUserInnComponent } from './person-user-inn.component';
import { ScreenService } from '../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { configureTestSuite } from 'ng-bullet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ConfigService, ConfigServiceStub, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentBase } from '../../../../screen/screen.types';
import { ActionType, ComponentActionDto } from '@epgu/epgu-constructor-types';

describe('PersonUserInnComponent', () => {
  let component: PersonUserInnComponent;
  let fixture: ComponentFixture<PersonUserInnComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;

  const mockData: ComponentBase = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: '',
  };

  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: null,
    type: ActionType.nextStepModal,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [PersonUserInnComponent, ActionDirective],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonUserInnComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = mockData;
    fixture.detectChanges();

    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('updateValue()', () => {
    it('should update value', () => {
      component.errors = [];
      component.updateValue('234324364634', []);

      expect(currentAnswersService.isValid).toEqual(true);
      expect(currentAnswersService.state).toEqual('234324364634');
    });

    it('shouldn\'t update value', () => {
      component.updateValue(null, []);

      expect(currentAnswersService.isValid).toEqual(false);
      expect(currentAnswersService.state).toEqual(undefined);
    });
  });

  describe('ngOnInit()', () => {
    it('should set initial state', () => {
      const updateValue = spyOn(component, 'updateValue');
      component.ngOnInit();
      expect(updateValue).toHaveBeenCalled();
    });
  });
});
