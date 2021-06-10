import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent } from 'ng-mocks';

import { CheckboxCubeContainerComponent } from './checkbox-cube-container.component';
import { CheckboxCubeComponent } from '../checkbox-cube/checkbox-cube.component';
import { DefaultUniqueScreenWrapperComponent } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';

describe('CheckboxCubeContainerComponent', () => {
  let component: CheckboxCubeContainerComponent;
  let fixture: ComponentFixture<CheckboxCubeContainerComponent>;
  let screenService: ScreenService;
  const cubeElements = {
    pd7o: {
      label: 'C1E',
      value: false,
    },
    pd7p: {
      label: 'D1E',
      value: false,
    },
  };
  const mockData = {
    id: 'pd7',
    type: 'CheckboxCube',
    label: 'Где посмотреть разрешённые категории',
    required: true,
    attrs: { cubeElements },
    value: '',
    visited: false,
  };

  const mockDataWithCache = {
    id: 'pd7',
    type: 'CheckboxCube',
    label: 'Где посмотреть разрешённые категории',
    required: true,
    attrs: { cubeElements },
    valueFromCache: true,
    value: JSON.stringify({
      pd7o: {
        label: 'C1E',
        value: true,
      },
      pd7p: {
        label: 'D1E',
        value: true,
      },
    }),
    visited: false,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckboxCubeContainerComponent,
        MockComponent(CheckboxCubeComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        UnsubscribeService,
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockData;
    fixture = TestBed.createComponent(CheckboxCubeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should create form after init', () => {
      expect(component.checkboxCubeForm.value).toEqual({
        pd7o: false,
        pd7p: false,
      });
    });

    it('should create form after init withValueFromCache', () => {
      screenService.component = mockDataWithCache;
      expect(component.checkboxCubeForm.value).toEqual({
        pd7p: true,
        pd7o: true,
      });
    });

    it('should setState', () => {
      expect(component.currentAnswersService.state).toEqual({
        pd7o: { value: false },
        pd7p: { value: false },
      });
      expect(component.currentAnswersService.isValid).toEqual(false);
    });
  });

  it('subscribeFormChanges', () => {
    component.checkboxCubeForm.patchValue({
      pd7o: true,
      pd7p: true,
    });

    expect(component.currentAnswersService.state).toEqual({
      pd7o: { value: true },
      pd7p: { value: true },
    });
    expect(component.currentAnswersService.isValid).toEqual(true);
  });
});
