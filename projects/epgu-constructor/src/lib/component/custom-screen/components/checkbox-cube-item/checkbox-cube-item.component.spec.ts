import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

import { CheckboxChange, ComponentDto } from '@epgu/epgu-constructor-types';

import { CheckboxCubeComponent } from '../../../../shared/components/checkbox-cube/checkbox-cube.component';
import { CheckboxCubeItemComponent } from './checkbox-cube-item.component';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';

describe('CheckboxCubeItemComponent', () => {
  let component: CheckboxCubeItemComponent;
  let fixture: ComponentFixture<CheckboxCubeItemComponent>;
  let control: FormControl;
  let formService: ComponentsListFormServiceStub;

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
      declarations: [CheckboxCubeItemComponent, MockComponent(CheckboxCubeComponent)],
      providers: [{ provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    fixture = TestBed.createComponent(CheckboxCubeItemComponent);
    component = fixture.componentInstance;
    control = new FormControl(mockComponent);
    formService.form = new FormArray([control]);
    component.componentIndex = 0;
    component.control = control;
    jest.spyOn(component.control, 'get').mockReturnValue(({
      setValue: jest.fn(),
      setErrors: jest.fn(),
    } as unknown) as AbstractControl);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleCheckboxChange()', () => {
    it('should call "emitToParentForm()" when checkbox changed', () => {
      const spy = jest.spyOn<CheckboxCubeItemComponent, any>(component, 'emitToParentForm');

      component.handleCheckboxChange(mockCheckboxChange);

      expect(spy).toBeCalledWith(mockCheckboxChange);
    });
  });

  describe('emitToParentForm()', () => {
    it('should set value to control if "isValid" is true and emit changes to formService', () => {
      const controlSetValueSpy = jest.spyOn(component.control.get('value'), 'setValue');
      const formServiceEmitChangesSpy = jest.spyOn(formService, 'emitChanges');

      (component as any).emitToParentForm(mockCheckboxChange);

      expect(controlSetValueSpy).toBeCalledTimes(1);
      expect(formServiceEmitChangesSpy).toBeCalledTimes(1);
    });

    it('should set errors to control if "isValid" is false and emit changes to formService', () => {
      const controlSetErrorsSpy = jest.spyOn(component.control.get('value'), 'setErrors');
      const formServiceEmitChangesSpy = jest.spyOn(formService, 'emitChanges');

      (component as any).emitToParentForm({ ...mockCheckboxChange, isValid: false });

      expect(controlSetErrorsSpy).toBeCalledTimes(1);
      expect(formServiceEmitChangesSpy).toBeCalledTimes(1);
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
