import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  Renderer2,
} from '@angular/core';
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  CheckboxList,
  CheckboxListComponentAttrsDto,
  CheckboxListElement,
} from '../../checkbox-list.types';

@Component({
  selector: 'epgu-constructor-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true,
    },
    UnsubscribeService,
  ],
})
export class CheckboxListComponent extends DefaultValueAccessor implements AfterViewInit {
  @Input() set attrs({ checkBoxes, ...attrs }: CheckboxListComponentAttrsDto) {
    this.initFormGroup(checkBoxes);
    this.setLabels(attrs);
    this.setCheckboxes(checkBoxes);
  }
  checkboxes: CheckboxList[];
  labels = { show: 'Показать больше', hide: 'Показать меньше' };
  hidden = true;
  checkBoxForm: FormGroup;

  constructor(
    protected renderer: Renderer2,
    protected elRef: ElementRef,
    private fb: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super(renderer, elRef, false);
  }

  checkboxesTrackBy = (_index, { id }: CheckboxList): string => id;

  ngAfterViewInit(): void {
    this.checkBoxForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((changes) => this.onChange(changes));
  }

  hideShow(): void {
    this.hidden = !this.hidden;
    this.checkboxes = this.checkboxes.map((el) => ({ ...el, hidden: !el.showOn && this.hidden }));
  }

  writeValue(value: string): void {
    this.checkBoxForm.patchValue(JSON.parse(value || '{}'), { emitEvent: false });
  }

  private initFormGroup(checkboxes: { [key: string]: CheckboxListElement }): void {
    const formGroup = Object.entries(checkboxes).reduce((form, [id, checkbox]) => {
      const control = new FormControl({ value: checkbox.value, disabled: false });
      return { ...form, [id]: control };
    }, {});
    this.checkBoxForm = this.fb.group(formGroup);
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
}
