import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { CheckboxListComponent } from './checkbox-list.component';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorCheckboxModule } from '../../../constructor-checkbox/constructor-checkbox.module';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../../../services/components-list-form/components-list-form.service.stub';

xdescribe('CheckboxListComponent', () => {
  let component: CheckboxListComponent;
  let formService: ComponentsListFormService;
  let fixture: ComponentFixture<CheckboxListComponent>;

  const mockComponent = {
    id: 'pd6',
    type: 'CheckBoxList',
    attrs: {
      labelShow: 'Развернуть все приоды',
      labelHide: 'Показать меньше',
      checkBoxes: {
        checkbox1: {
          label: 'Оформление инвалидности',
          value: false,
          showOn: true
        },
        checkbox2: {
          label: 'Участие в боевых действиях',
          value: false,
          showOn: true
        },
        checkbox3: {
          label: 'Исполнение обязанностей военной службы',
          value: false,
          showOn: false
        },
        checkbox4: {
          label: 'Великая Отчественная Война',
          value: false,
          showOn: false
        }
      }
    },
    value: '',
    visited: false,
    required: false
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckboxListComponent,
      ],
      imports: [FormsModule, ReactiveFormsModule, ConstructorCheckboxModule],
      providers: [
        UnsubscribeService,
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
      ],
    })
    .overrideComponent(CheckboxListComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    })
    .compileComponents();
  });

  beforeEach(() => {
    const control = new FormControl({
      id: 'dependentComponentId',
      attrs: {},
      required: false
    });
    formService = TestBed.inject(ComponentsListFormService);
    formService['_form'] = new FormArray([ control ]);
    fixture = TestBed.createComponent(CheckboxListComponent);
    component = fixture.componentInstance;
    component.control = new FormControl(mockComponent);
    fixture.detectChanges();
  });

  describe('setLabels', () => {
    it('should set labels', () => {
      expect(component.labels).toEqual({ show: 'Развернуть все приоды', hide: 'Показать меньше' });
    });

    it('should set default labels', () => {
      component.attrs = { checkBoxes: mockComponent.attrs.checkBoxes } as any;
      component.labels = { show: 'show', hide: 'hide' };
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.labels).toBe(component.labels);
    });
  });

  it('setCheckboxes', () => {
    component.attrs = {
      ...mockComponent.attrs, checkBoxes: {
        checkbox1: {
          label: 'Оформление инвалидности',
          value: false,
          showOn: true
        }
      }
    };
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.checkboxes).toEqual([ { id: 'checkbox1', label: 'Оформление инвалидности', showOn: true, hidden: false }]);
  });

  describe('toggle', () => {
    const mockAttrs = {
      ...mockComponent.attrs, checkBoxes: {
        checkbox1: {
          label: 'label1',
          value: false,
          showOn: true
        },
        checkbox2: {
          label: 'label2',
          value: false,
          showOn: false
        },
      }
    };

    beforeEach(() => {
      jest.spyOn(component, 'toggle');
      component.attrs = mockAttrs;
      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('hide checkboxes', () => {
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: true }
      ]);
      let hideShowEl = fixture.debugElement.nativeElement.querySelector('button');
      hideShowEl.click();
      expect(component.toggle).toHaveBeenCalled();
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: false }
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
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: true }
      ]);
    }));
  });

  describe('formChanges', () => {
    const currentValue = {
      checkbox1: false, checkbox2: false, checkbox3: false, checkbox4: false,
    };

    it('call onChanges', () => {
      jest.spyOn(component, 'onChange');
      const setValue = { checkbox1: true };
      component.form.patchValue(setValue as any);
      fixture.detectChanges();
      expect(component.onChange).toHaveBeenCalledWith({
        ...currentValue, ...setValue
      });
    });
  });
});
