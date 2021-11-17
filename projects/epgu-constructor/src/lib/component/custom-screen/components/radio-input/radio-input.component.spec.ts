import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadioInputComponent } from './radio-input.component';
import { MockComponents, MockModule, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormControlDirective,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { By } from '@angular/platform-browser';
import { BaseUiModule } from '@epgu/epgu-constructor-ui-kit';

const mockRadioComponent = {
  id: 'rb12',
  type: 'RadioInput',
  label: 'Осуждены ли вы за совершение преступления?',
  attrs: {},
  value: false,
  visited: false,
  required: false,
};

describe('RadioInputComponent', () => {
  let component: RadioInputComponent;
  let fixture: ComponentFixture<RadioInputComponent>;
  let formService: ComponentsListFormServiceStub;
  let control: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadioInputComponent, MockComponents(ComponentItemComponent)],
      imports: [MockModule(BaseUiModule)],
      providers: [
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(RadioInputComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    control = new FormGroup({
      id: new FormControl('id'),
      value: new FormControl(mockRadioComponent, [Validators.requiredTrue]),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(RadioInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should render epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.control).toBe(control.get('value'));
    expect(debugEl.componentInstance.component).toBe(control.value);
    expect(debugEl.componentInstance.invalid).toBeTruthy(); // потому что Validators.requiredTrue
    expect(debugEl.componentInstance.hidden).toBeFalsy();
    expect(debugEl.componentInstance.largeFontSize).toBeTruthy();

    control.get('value').setValue(true);
    fixture.detectChanges();
    expect(debugEl.componentInstance.invalid).toBeFalsy();
  });

  it('form__radio--inline / form__radio--block', () => {
    expect(fixture.debugElement.query(By.css('.form__radio--block'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.form__radio--inline'))).toBeNull();

    component.control = new FormControl({ ...mockRadioComponent, attrs: { isHorizontal: true }});
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.form__radio--block'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.form__radio--inline'))).toBeTruthy();
  });

  it('should render lib-radio', () => {
    const selector = 'lib-radio';
    let debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(0);

    component.control = new FormControl({
      ...mockRadioComponent,
      attrs: {
        supportedValues: [
          {
            label: 'Да',
            value: '1',
          },
          {
            label: 'Нет',
            value: '0',
          },
        ],
      },
    });
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(2);

    expect(debugElements[0].componentInstance.name).toBe('rb12');
    expect(debugElements[0].componentInstance.labelText).toBe('Да');
    expect(debugElements[0].injector.get(FormControlDirective).form).toBe(
      component.control.get('value'),
    );
    expect(debugElements[0].componentInstance.value).toBe('1');
  });
});
