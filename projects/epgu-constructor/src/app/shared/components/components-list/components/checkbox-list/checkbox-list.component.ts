import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
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
import { merge } from 'rxjs';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  CheckboxList,
  CheckboxListComponentAttrsDto,
  CheckboxListElement,
} from './checkbox-list.types';
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
  implements AfterViewInit, OnInit, OnChanges {
  @Input() componentIndex = 0;
  @Input() componentsGroupIndex = 0;

  control: FormGroup | AbstractControl;
  attrs: CheckboxListComponentAttrsDto;
  required: boolean;
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
    public cdr: ChangeDetectorRef,
  ) {
    super(renderer, elRef, false);
  }

  checkboxesTrackBy = (_index, { id }: CheckboxList): string => id;

  ngOnInit(): void {
    this.control = this.formService.form.controls[this.componentIndex];
    this.attrs = this.control.value.attrs;
    this.required = this.control.value.required;
    merge(this.control.statusChanges, this.control.valueChanges)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

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
