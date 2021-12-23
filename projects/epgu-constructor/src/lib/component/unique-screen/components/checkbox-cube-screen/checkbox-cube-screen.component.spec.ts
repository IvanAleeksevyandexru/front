import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

import { CheckboxChange, ComponentDto } from '@epgu/epgu-constructor-types';
import {
  ScreenPadComponent,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { CheckboxCubeComponent } from '../../../../shared/components/checkbox-cube/checkbox-cube.component';
import { CheckboxCubeScreenComponent } from './checkbox-cube-screen.component';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../screen/current-answers-service.stub';
import { DefaultUniqueScreenWrapperComponent } from '../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';

describe('CheckboxCubeScreenComponent', () => {
  let component: CheckboxCubeScreenComponent;
  let fixture: ComponentFixture<CheckboxCubeScreenComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;

  const mockCubeElements = {
    pd7o: {
      label: 'C1E',
      value: false,
    },
    pd7p: {
      label: 'D1E',
      value: false,
    },
  };

  const mockComponent: ComponentDto = {
    id: 'pd7',
    type: 'CheckboxCube',
    label: 'Где посмотреть разрешённые категории',
    required: true,
    attrs: {
      cubeElements: mockCubeElements,
    },
    value: '',
    visited: false,
  };

  const mockCheckboxChange: CheckboxChange = {
    changes: {
      ...mockCubeElements,
    },
    isValid: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckboxCubeScreenComponent,
        MockComponent(CheckboxCubeComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
        MockComponent(ScreenPadComponent),
      ],
      providers: [
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = mockComponent;
    fixture = TestBed.createComponent(CheckboxCubeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCheckboxChange()', () => {
    it('should call "setState()" when checkbox changed', () => {
      const spy = jest.spyOn<CheckboxCubeScreenComponent, any>(component, 'setState');

      component.handleCheckboxChange(mockCheckboxChange);

      expect(spy).toBeCalledWith(mockCheckboxChange);
    });
  });

  describe('setState()', () => {
    it('should set "state" and "isValid" to "currentAnswersService"', () => {
      const stateSetterSpy = jest.spyOn(currentAnswersService, 'state', 'set');
      const isValidSetterSpy = jest.spyOn(currentAnswersService, 'state', 'set');

      (component as any).setState(mockCheckboxChange);

      expect(stateSetterSpy).toBeCalledTimes(1);
      expect(isValidSetterSpy).toBeCalledTimes(1);
    });
  });

  describe('render', () => {
    const selector = 'epgu-constructor-checkbox-cube';

    it('should render CheckboxCube component', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });
  });
});
