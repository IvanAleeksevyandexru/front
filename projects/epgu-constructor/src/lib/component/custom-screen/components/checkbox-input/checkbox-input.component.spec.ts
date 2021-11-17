import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockComponents, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { CheckboxInputComponent } from './checkbox-input.component';
import { ConstructorCheckboxComponent } from '@epgu/epgu-constructor-ui-kit';

const mockCheckboxComponent = {
  id: 'Is_markTS_no',
  type: 'CheckBox',
  label: 'Марки автомобиля нет в списке',
  attrs: {},
  value: false,
  visited: false,
  required: false,
};

describe('CheckboxInputComponent', () => {
  let component: CheckboxInputComponent;
  let fixture: ComponentFixture<CheckboxInputComponent>;
  let formService: ComponentsListFormServiceStub;
  let control: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckboxInputComponent,
        MockComponents(ComponentItemComponent, ConstructorCheckboxComponent),
      ],
      providers: [
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(CheckboxInputComponent, {
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
      value: new FormControl(mockCheckboxComponent),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(CheckboxInputComponent);
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
  });

  it('form__radio--inline/ form__radio--block', () => {
    expect(fixture.debugElement.query(By.css('.form__radio--block'))).toBeTruthy();
    component.control = new FormControl({
      ...mockCheckboxComponent,
      attrs: { isHorizontal: true },
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.form__radio--block'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.form__radio--inline'))).toBeTruthy();
  });
});
