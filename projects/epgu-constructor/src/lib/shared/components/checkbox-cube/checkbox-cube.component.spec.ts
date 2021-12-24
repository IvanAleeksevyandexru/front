import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MockComponent, MockModule } from 'ng-mocks';

import {
  ConstructorCheckboxComponent,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentDto } from '@epgu/epgu-constructor-types';

import { BaseModule } from '../../base.module';
import { CheckboxCubeComponent } from './checkbox-cube.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

describe('CheckboxCubeComponent', () => {
  let component: CheckboxCubeComponent;
  let fixture: ComponentFixture<CheckboxCubeComponent>;

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

  const mockPresetCubeElements = {
    pd7o: {
      label: 'C1E',
      value: true,
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
    value: JSON.stringify({
      pd7o: { value: true },
      pd7p: { value: false },
    }),
    visited: false,
    valueFromCache: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxCubeComponent, MockComponent(ConstructorCheckboxComponent)],
      providers: [FormBuilder, { provide: UnsubscribeService, useClass: UnsubscribeServiceStub }],
      imports: [MockModule(BaseModule)],
    })
      .overrideComponent(CheckboxCubeComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxCubeComponent);
    component = fixture.componentInstance;
    component.component = mockComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call "init()" and "subscribeFormChanges()"', () => {
      const initSpy = jest.spyOn<CheckboxCubeComponent, any>(component, 'init');
      const subscribeFormChangesSpy = jest.spyOn<CheckboxCubeComponent, any>(
        component,
        'subscribeFormChanges',
      );

      component.ngOnInit();

      expect(initSpy).toBeCalledTimes(1);
      expect(subscribeFormChangesSpy).toBeCalledTimes(1);
    });
  });

  describe('init()', () => {
    it('should set checkboxIds from component.attrs', () => {
      (component as any).init();

      expect(component.checkboxIds).toEqual(Object.keys(mockCubeElements));
    });

    it('should set cubeElements from component.attrs if "valueFromCache is" false', () => {
      (component as any).init();

      expect(component.cubeElements).toEqual(mockCubeElements);
    });

    it('should set preset cubeElements from component.attrs if "valueFromCache is" true', () => {
      (component.component as any).valueFromCache = true;
      (component as any).init();

      expect(component.cubeElements).toEqual(mockPresetCubeElements);
    });

    it('should call "initForm()"', () => {
      const spy = jest.spyOn<CheckboxCubeComponent, any>(component, 'initForm');

      (component as any).init();

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('subscribeFormChanges()', () => {
    it('should emit changes when form changed', () => {
      const emitSpy = jest.spyOn(component.changed, 'emit');

      component.ngOnInit();
      component.checkboxCubeForm.get('pd7o').setValue('true');

      expect(emitSpy).toBeCalledTimes(2);
    });
  });

  describe('getPresetCubeElements()', () => {
    it('should return presetCubeElements', () => {
      (component.component as any).valueFromCache = true;
      const presetCubeElements = (component as any).getPresetCubeElements(mockCubeElements);

      expect(presetCubeElements).toEqual(mockPresetCubeElements);
    });
  });

  describe('initForm()', () => {
    it('should set checkboxCubeForm', () => {
      component.checkboxIds = Object.keys(mockCubeElements);
      (component as any).initForm();
      const expectedValue = {
        pd7o: true,
        pd7p: false,
      };

      expect(component.checkboxCubeForm).toBeTruthy();
      expect(component.checkboxCubeForm.value).toEqual(expectedValue);
    });

    it('should emit initialValues', () => {
      const spy = jest.spyOn(component.changed, 'emit');
      component.checkboxIds = Object.keys(mockCubeElements);
      (component as any).initForm();

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('isValid()', () => {
    it('should return true if "component.required" is false', () => {
      component.required = false;
      component.checkboxCubeForm.get('pd7o').setValue(false);
      component.checkboxCubeForm.get('pd7p').setValue(false);
      const isValid = (component as any).isValid;

      expect(isValid).toBeTruthy();
    });

    it('should return true if checkboxCubeForm has at least one truthy checkbox', () => {
      component.required = true;
      component.checkboxCubeForm.get('pd7o').setValue(true);
      component.checkboxCubeForm.get('pd7p').setValue(false);
      const isValid = (component as any).isValid;

      expect(isValid).toBeTruthy();
    });

    it('should return false if "component.required" is true and checkboxCubeForm has not any truthy checkbox', () => {
      component.required = true;
      component.checkboxCubeForm.get('pd7o').setValue(false);
      component.checkboxCubeForm.get('pd7p').setValue(false);
      const isValid = (component as any).isValid;

      expect(isValid).toBeFalsy();
    });
  });

  describe('render', () => {
    it('should render "epgu-constructor-output-html" with label and clarifications if there is in Input', () => {
      const selector = 'epgu-constructor-output-html';
      component.label = 'Test label';
      component.clarifications = {
        id1: {
          title: 'Test title',
        },
      };
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should render formGroup div if checkboxCubeForm exist', () => {
      const selector = '.checkbox-cube';
      component.checkboxCubeForm = new FormGroup({});
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should not render formGroup div if checkboxCubeForm not exist', () => {
      const selector = '.checkbox-cube';
      component.checkboxCubeForm = null;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();
    });
  });
});
