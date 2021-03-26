import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  CheckboxList,
  CheckboxListComponentAttrsDto,
  CheckboxListElement,
} from '../../checkbox-list.types';
import { ComponentsListFormService } from '../../../../services/components-list-form/components-list-form.service';

@Component({
  selector: 'epgu-constructor-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true,
    },
    UnsubscribeService,
  ],
})
export class CheckboxListComponent extends DefaultValueAccessor
  implements AfterViewInit, OnChanges {
  @Input() componentIndex = 0;
  @Input() componentsGroupIndex = 0;

  formControl: FormGroup | AbstractControl = this.formService.form.controls[this.componentIndex];
  attrs: CheckboxListComponentAttrsDto = this.formControl.value.attrs;
  required: boolean = this.formControl.value.required;
  checkboxes: CheckboxList[];
  labels = { show: 'Показать больше', hide: 'Показать меньше' };
  hidden = true;
  checkBoxForm: FormGroup;

  constructor(
    public formService: ComponentsListFormService,
    protected renderer: Renderer2,
    protected elRef: ElementRef,
    private fb: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super(renderer, elRef, false);
  }

  checkboxesTrackBy = (_index, { id }: CheckboxList): string => id;

  ngOnChanges(): void {
    const { checkBoxes, ...cmpAttrs } = this.attrs;
    this.initFormGroup(checkBoxes);
    this.setLabels(cmpAttrs);
    this.setCheckboxes(checkBoxes);
  }

  ngAfterViewInit(): void {
    this.checkBoxForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((changes) => this.onChange(changes));
  }

  toggle(): void {
    this.hidden = !this.hidden;
    this.checkboxes = this.checkboxes.map((el) => ({ ...el, hidden: !el.showOn && this.hidden }));
  }

  writeValue(value: string): void {
    this.checkBoxForm.patchValue(JSON.parse(value || '{}'), { emitEvent: false });
  }

  validate(): ValidationErrors | null {
    return this.checkBoxForm.valid ? null : this.checkBoxForm.errors;
  }

  private initFormGroup(checkboxes: { [key: string]: CheckboxListElement }): void {
    const validators = this.required ? [this.requiredValidatorFn()] : [];
    const formGroup = Object.entries(checkboxes).reduce((form, [id, checkbox]) => {
      const control = new FormControl({ value: checkbox.value, disabled: false });
      return { ...form, [id]: control };
    }, {});
    this.checkBoxForm = this.fb.group(formGroup, { validators });
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
