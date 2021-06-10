import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { MaskedAndPlainInputComponent } from './masked-and-plain-input.component';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ComponentItemModule } from '../component-item/component-item.module';
import { ConstructorMaskedInputModule } from '../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';

describe('MaskedAndPlainInputComponent', () => {
  let component: MaskedAndPlainInputComponent;
  let fixture: ComponentFixture<MaskedAndPlainInputComponent>;
  let formService: ComponentsListFormService;
  let control: FormGroup;

  const mockPlainComponent = {
    id: 'StringInput',
    type: 'StringInput',
    label: 'Марка автомобиля',
    attrs: {},
    value: false,
    visited: false,
    required: false,
  };

  const mockMaskedComponent = {
    id: 'ow1_7',
    type: 'StringInput',
    label: 'Контактный телефон',
    attrs: {
      checkedPhoneNumber: '',
      validation: [],
      mask: ['+', '7'],
    },
    required: false,
    value: '',
    visited: false,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MaskedAndPlainInputComponent],
      imports: [
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorMaskedInputModule),
        MockModule(ComponentItemModule),
      ],
      providers: [
        UnsubscribeService,
        SuggestHandlerService,
        EventBusService,
        {
          provide: ComponentsListFormService,
          useClass: ComponentsListFormServiceStub,
        },
        {
          provide: ScreenService,
          useClass: ScreenServiceStub,
        },
      ],
    })
      .overrideComponent(MaskedAndPlainInputComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    fixture = TestBed.createComponent(MaskedAndPlainInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
  });

  describe('plain input', () => {
    beforeEach(() => {
      control = new FormGroup({
        id: new FormControl(mockPlainComponent.id),
        value: new FormControl(mockPlainComponent),
        attrs: new FormControl(mockPlainComponent.attrs),
      });
      formService['_form'] = new FormArray([control]);
      fixture.detectChanges();
    });

    it('should be render plain input', () => {
      const selector = 'epgu-constructor-constructor-plain-input';
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });
  });

  describe('masked input', () => {
    beforeEach(() => {
      control = new FormGroup({
        id: new FormControl(mockMaskedComponent.id),
        value: new FormControl(mockMaskedComponent),
        attrs: new FormControl(mockMaskedComponent.attrs),
      });
      formService['_form'] = new FormArray([control]);
      fixture.detectChanges();
    });

    it('should be render masked input', () => {
      const selector = 'epgu-constructor-masked-input';
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });
  });
});
