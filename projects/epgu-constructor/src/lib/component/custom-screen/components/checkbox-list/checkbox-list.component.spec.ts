import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockProvider } from 'ng-mocks';
import { CheckboxListComponent } from './checkbox-list.component';
import { ConstructorCheckboxModule } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

const mockComponent = {
  id: 'pd6',
  type: 'CheckBoxList',
  attrs: {
    labelShow: 'Развернуть все приоды',
    labelHide: 'Показать меньше',
    limit: 2,
    checkBoxes: {
      checkbox1: {
        label: 'Оформление инвалидности',
        value: false,
        showOn: true,
      },
      checkbox2: {
        label: 'Участие в боевых действиях',
        value: false,
        showOn: true,
      },
      checkbox3: {
        label: 'Исполнение обязанностей военной службы',
        value: false,
        showOn: false,
      },
      checkbox4: {
        label: 'Великая Отчественная Война',
        value: false,
        showOn: false,
      },
    },
  },
  value: '{}',
  visited: false,
  required: false,
};

describe('CheckboxListComponent', () => {
  let component: CheckboxListComponent;
  let formService: ComponentsListFormServiceStub;
  let fixture: ComponentFixture<CheckboxListComponent>;
  let control: FormControl;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxListComponent],
      imports: [FormsModule, ReactiveFormsModule, ConstructorCheckboxModule],
      providers: [
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
      .overrideComponent(CheckboxListComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    fixture = TestBed.createComponent(CheckboxListComponent);
    component = fixture.componentInstance;
    control = new FormControl(mockComponent);
    formService['_form'] = new FormArray([control]);
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  describe('setLabels', () => {
    it('should set labels', () => {
      expect(component.labels).toEqual({ show: 'Развернуть все приоды', hide: 'Показать меньше' });
    });

    it('should set default labels', () => {
      component.control = new FormControl({
        ...mockComponent,
        attrs: { checkBoxes: mockComponent.attrs.checkBoxes },
      });
      component.labels = { show: 'show', hide: 'hide' };
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.labels).toBe(component.labels);
    });
  });

  it('setCheckboxes', () => {
    component.control = new FormControl({
      ...mockComponent,
      attrs: {
        ...mockComponent.attrs,
        checkBoxes: {
          checkbox1: {
            label: 'Оформление инвалидности',
            value: false,
            showOn: true,
          },
        },
      },
    });
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.checkboxes).toEqual([
      { id: 'checkbox1', label: 'Оформление инвалидности', showOn: true, hidden: false },
    ]);
  });

  describe('requiredValidator', () => {
    it('shouldn`t have and form valid', () => {
      expect(component.form.hasError('required')).toBeFalsy();
      expect(component.form.valid).toBeTruthy();
    });
    it('should have and form invalid and set valid when choosing at least one', () => {
      component.control = new FormControl({ ...mockComponent, required: true });
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.form.hasError('required')).toBeTruthy();
      expect(component.form.valid).toBeFalsy();

      component.form.patchValue({ checkbox1: true });
      expect(component.form.hasError('required')).toBeFalsy();
      expect(component.form.valid).toBeTruthy();
    });
  });

  describe('toggle', () => {
    const mockAttrs = {
      ...mockComponent.attrs,
      checkBoxes: {
        checkbox1: {
          label: 'label1',
          value: false,
          showOn: true,
        },
        checkbox2: {
          label: 'label2',
          value: false,
          showOn: false,
        },
      },
    };

    beforeEach(() => {
      jest.spyOn(component, 'toggle');
      component.control = new FormControl({ ...mockComponent, attrs: mockAttrs });
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('hide checkboxes', () => {
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: true },
      ]);
      let hideShowEl = fixture.debugElement.nativeElement.querySelector('button');
      hideShowEl.click();
      expect(component.toggle).toHaveBeenCalled();
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: false },
      ]);
    });

    it('show checkboxes', fakeAsync(() => {
      let hideShowEl = fixture.debugElement.nativeElement.querySelector('button');
      hideShowEl.click();
      expect(component.toggle).toHaveBeenCalled();
      hideShowEl.click();
      tick();
      expect(component.toggle).toHaveBeenCalled();
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: true },
      ]);
    }));


  });

  describe('formChanges', () => {
    const currentValue = {
      checkbox1: false, checkbox2: false, checkbox3: false, checkbox4: false,
    };

    it('call emitToParentForm', () => {
      jest.spyOn(component, 'emitToParentForm');
      const setValue = { checkbox1: true };
      component.form.patchValue(setValue as any);
      fixture.detectChanges();
      expect(component.emitToParentForm).toHaveBeenCalledWith({
        ...currentValue,
        ...setValue,
      });
    });

    it('call checkShownElements', () => {
      jest.spyOn(component, 'checkShownElements');
      const setValue = { checkbox1: true, checkbox2: true, checkbox3: true, checkbox4: false };
      component.form.patchValue(setValue as any);
      fixture.detectChanges();
      expect(component.checkShownElements).toHaveBeenCalledWith(setValue);
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'Оформление инвалидности', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'Участие в боевых действиях', showOn: true, hidden: false },
        { id: 'checkbox3', label: 'Исполнение обязанностей военной службы', showOn: false, hidden: true },
        { id: 'checkbox4', label: 'Великая Отчественная Война', showOn: false, hidden: true },
      ]);
    });
  });
});
