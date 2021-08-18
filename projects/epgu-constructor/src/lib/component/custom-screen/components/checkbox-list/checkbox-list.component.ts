import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import {
  CheckboxList,
  CheckboxListComponentAttrsDto,
  CheckboxListElement,
} from './checkbox-list.types';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class CheckboxListComponent extends AbstractComponentListItemComponent
  implements AfterViewInit, OnInit, OnChanges {
  checkboxes: CheckboxList[];
  labels = { show: 'Показать больше', hide: 'Показать меньше' };
  hidden = true;
  form: FormGroup;

  constructor(public injector: Injector, private fb: FormBuilder) {
    super(injector);
  }

  checkboxesTrackBy = (_index, { id }: CheckboxList): string => id;

  ngOnInit(): void {
    super.ngOnInit();
    this.loadCachedValues();
    this.setValidatorsForParenForm();
    this.updateCheckboxes();
  }

  ngOnChanges(): void {
    this.updateCheckboxes();
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((changes) => {
      this.checkShownElements(changes);
      this.emitToParentForm(changes);
    });
  }

  checkShownElements(changes): void {
    const truthfulCount = Object.values(changes).filter((value) => value).length;
    if (this.limit && truthfulCount === this.limit) {
      this.hidden = !this.hidden;
      this.checkboxes = this.checkboxes.map((el) => ({
        ...el,
        hidden: !changes[el.id] && this.hidden,
      }));
    }
  }

  loadCachedValues(): void {
    const cachedValue = this.control.value.value;

    if (cachedValue) {
      const values = JSON.parse(cachedValue) as { [key: string]: boolean };
      Object.entries(values).forEach(([boxName, value]) => {
        this.control.value.attrs.checkBoxes[boxName].value = value;
      });
    }
  }

  setValidatorsForParenForm(): void {
    const validator: ValidatorFn = () => (this.form.valid ? null : this.form.errors);
    this.control.setValidators(validator);
  }

  emitToParentForm(changes): void {
    if (this.form.valid) {
      this.control.get('value').setValue(changes);
    } else {
      this.control.get('value').setErrors({ invalidForm: true });
    }
    this.formService.emitChanges();
  }

  updateCheckboxes(): void {
    const { checkBoxes, ...cmpAttrs } = this.control.value.attrs;
    this.initFormGroup(checkBoxes);
    this.setLabels(cmpAttrs);
    this.setCheckboxes(checkBoxes);
    this.cdr.markForCheck();
  }

  toggle(): void {
    this.hidden = !this.hidden;
    this.checkboxes = this.checkboxes.map((el) => ({ ...el, hidden: !el.showOn && this.hidden }));
    this.cdr.markForCheck();
  }

  isButtonShow(): boolean {
    return this.checkboxes.some((el) => !el.showOn);
  }

  private initFormGroup(checkboxes: { [key: string]: CheckboxListElement }): void {
    const validators = this.control.value.required ? [this.requiredValidatorFn()] : [];
    const formGroup = Object.entries(checkboxes).reduce((form, [id, checkbox]) => {
      const control = new FormControl({ value: checkbox.value, disabled: false });
      return { ...form, [id]: control };
    }, {});
    this.form = this.fb.group(formGroup, { validators });
  }

  private setCheckboxes(checkboxElements: { [key: string]: CheckboxListElement }): void {
    this.checkboxes = Object.entries(checkboxElements).map<CheckboxList>(
      ([id, { label, showOn }]) => ({
        id,
        label,
        showOn,
        hidden: !showOn,
      }),
    );
  }

  private setLabels({
    labelShow = null,
    labelHide = null,
  }: Partial<CheckboxListComponentAttrsDto>): void {
    if (labelShow) {
      this.labels.show = labelShow;
    }
    if (labelHide) {
      this.labels.hide = labelHide;
    }
  }

  private requiredValidatorFn(): ValidatorFn {
    return ({ value }: FormGroup): ValidationErrors => {
      const isValid = Object.values(value).some((val) => !!val);
      return isValid ? null : { required: true };
    };
  }
}
