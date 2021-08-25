import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { MockComponent, MockProvider } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { FormDisclaimerComponent } from './form-disclaimer.component';
import { CustomScreenComponentTypes } from '../../components-list.types';
import { DisclaimerComponent } from '../../../../shared/components/disclaimer/disclaimer.component';

const mockFormDisclaimerComponent = {
  id: 'id',
  type: CustomScreenComponentTypes.Disclaimer,
  attrs: {
    type: 'warn',
    title: 'Some title',
    description: 'Some description',
    clarifications: 'fake clarifications'
  },
  value: '',
  visited: false,
  required: false
};

describe('FormDisclaimerComponent', () => {
  let component: FormDisclaimerComponent;
  let fixture: ComponentFixture<FormDisclaimerComponent>;
  let formService: ComponentsListFormServiceStub;
  let control: FormGroup;
  let fb: FormBuilder;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormDisclaimerComponent,
        MockComponent(DisclaimerComponent)
      ],
      providers: [
        FormBuilder,
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    }).overrideComponent(FormDisclaimerComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fb = TestBed.inject(FormBuilder);
    formService = TestBed.inject(ComponentsListFormService) as unknown as ComponentsListFormServiceStub;
    control = fb.group(mockFormDisclaimerComponent);
    formService['_form'] = new FormArray([ control ]);
    fixture = TestBed.createComponent(FormDisclaimerComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('epgu-constructor-disclaimer', () => {
    it('should pass disclaimer component properties properties', () => {
      const selector = 'epgu-constructor-disclaimer';
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
      expect(debugEl.componentInstance.type).toBe(mockFormDisclaimerComponent.attrs.type);
      expect(debugEl.componentInstance.title).toBe(mockFormDisclaimerComponent.attrs.title);
      expect(debugEl.componentInstance.description).toBe(mockFormDisclaimerComponent.attrs.description);
      expect(debugEl.componentInstance.clarifications).toBe(mockFormDisclaimerComponent.attrs.clarifications);
    });
  });
});
