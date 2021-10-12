import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldListItemComponent } from './field-list-item.component';
import { BaseModule } from '../../../../shared/base.module';
import { MockComponent, MockProvider } from 'ng-mocks';
import { FieldListComponent } from '../../../../shared/components/field-list/field-list.component';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { By } from '@angular/platform-browser';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { FormArray, FormControl } from '@angular/forms';

describe('ConstructorCheckboxComponent', () => {
  let component: FieldListItemComponent;
  let fixture: ComponentFixture<FieldListItemComponent>;

  let control1: FormControl;
  let control2: FormControl;

  const initComponent = () => {
    fixture = TestBed.createComponent(FieldListItemComponent);
    component = fixture.componentInstance;
  };

  beforeEach(async () => {
    control1 = new FormControl('control1 value');
    control2 = new FormControl('control2 value');

    await TestBed.configureTestingModule({
      declarations: [FieldListItemComponent, MockComponent(FieldListComponent)],
      imports: [BaseModule],
      providers: [
        MockProvider(ComponentsListFormService, {
          form: new FormArray([control1, control2]),
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    initComponent();
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('epgu-constructor-field-list', () => {
    const selector = 'epgu-constructor-field-list';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();
    });

    it('data property should be equal form.controls[componentIndex].value', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.data).toBe('control1 value');

      initComponent();
      component.componentIndex = 1;
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.data).toBe('control2 value');
    });
  });
});
