import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonUserInnComponent } from './person-user-inn.component';
import { ScreenService } from '../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ComponentBase } from '../../../../screen/screen.types';
import { ActionType, ComponentActionDto } from '@epgu/epgu-constructor-types';

describe('PersonUserInnComponent', () => {
  let component: PersonUserInnComponent;
  let fixture: ComponentFixture<PersonUserInnComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;

  const validInnValue = '234324364634';

  const invalidInnValues = [
    '23432436463',
    '23432436463435345',
    '234324s36463435345',
    '23^343434343',
    '345ds545',
    '345аывп545',
  ];

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [PersonUserInnComponent, ActionDirective],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
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
      component.updateValue(validInnValue, []);

      expect(currentAnswersService.isValid).toEqual(true);
      expect(currentAnswersService.state).toEqual(validInnValue);
    });

    it('shouldn\'t update value', () => {
      component.updateValue(null, []);

      expect(currentAnswersService.isValid).toEqual(false);
      expect(currentAnswersService.state).toEqual(undefined);
    });
  });

  describe('inn value validity', () => {
    it('should be valid inn value if match regex', () => {
      component.errors = [];
      component.updateValue(validInnValue, []);

      expect(currentAnswersService.isValid).toEqual(true);
      expect(currentAnswersService.state).toEqual(validInnValue);
    });

    it.each(invalidInnValues)('should be invalid inn value if not match regex', (invalidInn) => {
      component.errors = [];
      screenService.component.value = invalidInn;
      component.ngOnInit();
      fixture.detectChanges();
      component.updateValue(invalidInn, []);

      expect(currentAnswersService.isValid).toEqual(false);
      expect(currentAnswersService.state).toEqual(invalidInn);
    });
  });

  describe('ngOnInit()', () => {
    it('should set initial state', () => {
      const updateValue = jest.spyOn(component, 'updateValue');
      component.ngOnInit();
      expect(updateValue).toHaveBeenCalled();
    });
  });
});
