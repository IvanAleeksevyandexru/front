import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { CheckboxListComponent } from './checkbox-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorCheckboxModule } from '../../../constructor-checkbox/constructor-checkbox.module';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';

describe('CheckboxListComponent', () => {
  let component: CheckboxListComponent;
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
      providers: [UnsubscribeService],
    })
    .overrideComponent(CheckboxListComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListComponent);
    component = fixture.componentInstance;
    component.attrs = mockComponent.attrs;
    fixture.detectChanges();
  });

  describe('setLabels', () => {
    it('should set labels', () => {
      component.attrs = mockComponent.attrs;
      fixture.detectChanges();
      expect(component.labels).toEqual({ show: 'Развернуть все приоды', hide: 'Показать меньше' });
    });

    it('should set default labels', () => {
      component.attrs = { checkBoxes: mockComponent.attrs.checkBoxes } as any;
      component.labels = { show: 'show', hide: 'hide' };
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
    fixture.detectChanges();
    expect(component.checkboxes).toEqual([ { id: 'checkbox1', label: 'Оформление инвалидности', showOn: true, hidden: false }]);
  });

  describe('hideShow', () => {
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
      jest.spyOn(component, 'hideShow');
      component.attrs = mockAttrs;
    });

    it('hide checkboxes', () => {
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: true }
      ]);
      let hideShowEl = fixture.debugElement.nativeElement.querySelector('button');
      hideShowEl.click();
      expect(component.hideShow).toHaveBeenCalled();
      expect(component.checkboxes).toEqual([
        { id: 'checkbox1', label: 'label1', showOn: true, hidden: false },
        { id: 'checkbox2', label: 'label2', showOn: false, hidden: false }
      ]);
    });

    it('show checkboxes', fakeAsync(() => {
      let hideShowEl = fixture.debugElement.nativeElement.querySelector('button');
      hideShowEl.click();
      expect(component.hideShow).toHaveBeenCalled();
      hideShowEl.click();
      tick();
      expect(component.hideShow).toHaveBeenCalled();
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
      component.checkBoxForm.patchValue(setValue as any);
      fixture.detectChanges();
      expect(component.onChange).toHaveBeenCalledWith({
        ...currentValue, ...setValue
      });
    });

    it('call writeValue', () => {
      const setValue = { checkbox1: true, checkbox2: true };
      fixture.componentInstance.writeValue(JSON.stringify(setValue));
      expect(component.checkBoxForm.value).toEqual({
        ...currentValue, ...setValue
      });
    });
  });
});
