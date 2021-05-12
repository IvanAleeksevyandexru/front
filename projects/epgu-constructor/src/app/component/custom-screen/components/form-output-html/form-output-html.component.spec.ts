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
import { FormOutputHtmlComponent } from './form-output-html.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { CustomScreenComponentTypes } from '../../components-list.types';

const mockFormOutputHtmlComponent = {
  id: 'id',
  type: CustomScreenComponentTypes.LabelSection,
  label: 'fake label',
  attrs: { clarifications: 'fake clarifications' },
  value: '',
  visited: false,
  required: false
};

describe('FormOutputHtmlComponent', () => {
  let component: FormOutputHtmlComponent;
  let fixture: ComponentFixture<FormOutputHtmlComponent>;
  let formService: ComponentsListFormServiceStub;
  let control: FormGroup;
  let fb: FormBuilder;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FormOutputHtmlComponent,
        MockComponent(OutputHtmlComponent)
      ],
      providers: [
        FormBuilder,
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    }).overrideComponent(FormOutputHtmlComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fb = TestBed.inject(FormBuilder);
    formService = TestBed.inject(ComponentsListFormService) as unknown as ComponentsListFormServiceStub;
    control = fb.group(mockFormOutputHtmlComponent);
    formService['_form'] = new FormArray([ control ]);
    fixture = TestBed.createComponent(FormOutputHtmlComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('epgu-constructor-output-html', () => {
    it('input properties', () => {
      const selector = 'epgu-constructor-output-html';
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
      expect(debugEl.componentInstance.html).toBe(mockFormOutputHtmlComponent.label);
      expect(debugEl.componentInstance.clarifications).toBe(mockFormOutputHtmlComponent.attrs.clarifications);
      expect(debugEl.componentInstance.componentId).toBe(mockFormOutputHtmlComponent.id);
    });

    it('label/info__text classes', () => {
      expect(fixture.debugElement.query(By.css('.label'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.info__text'))).toBeNull();
      component.control = new FormControl({
        ...mockFormOutputHtmlComponent,
        type: CustomScreenComponentTypes.HtmlString
      });
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.label'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.info__text'))).toBeTruthy();
    });
  });
});
