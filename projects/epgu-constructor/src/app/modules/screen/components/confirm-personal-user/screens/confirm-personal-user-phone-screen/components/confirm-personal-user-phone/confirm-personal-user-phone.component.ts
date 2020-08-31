import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseMaskedInputComponent, ValidationShowOn } from 'epgu-lib';
import { delay, takeUntil } from 'rxjs/operators';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserPhoneComponent implements OnInit, OnChanges {
  @ViewChild('mask', { static: true }) mask: BaseMaskedInputComponent;
  @Input() label: string;
  @Input() data: string;
  @Input() error: string;
  @Input() isEditButtonShown: boolean;
  @Output() dataChanged = new EventEmitter();

  phoneForm: FormGroup;
  validationShowOn = ValidationShowOn.TOUCHED;
  phoneMask = [
    '+',
    '7',
    ' ',
    '(',
    /[1-9]/,
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];

  constructor(
    private formBuilder: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private componentStateService: ComponentStateService,
  ) {}

  ngOnInit(): void {
    this.phoneForm = this.formBuilder.group({
      phone: this.formBuilder.control(
        {
          value: this.data || '',
          disabled: true,
        },
        {
          validators: Validators.compose([Validators.required, Validators.minLength(18)]),
        },
      ),
    });

    this.phoneForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), delay(0))
      .subscribe((change) => {
        const { phone } = change;
        const phoneUnmasked = phone.replace(/[\s|-]+/g, ''); // backend-friendly format +7(999)1234567
        this.componentStateService.isValid = this.phoneForm.controls.phone.valid;
        this.componentStateService.state = phoneUnmasked;
        this.dataChanged.emit(phoneUnmasked);
      });

    this.componentStateService.state = this.data;
    this.componentStateService.isValid = true;
  }

  ngOnChanges(): void {
    if (this.phoneForm) {
      if (this.error) {
        this.phoneForm.controls.phone.setErrors({ incorrect: true });
        this.phoneForm.controls.phone.enable();
      } else {
        this.phoneForm.controls.phone.setErrors(null);
      }
    }
  }

  handleClick() {
    this.phoneForm.controls.phone.enable();
    // @ts-ignore
    const data = this.mask.textMaskInputElement.state.previousConformedValue || this.data;
    this.mask.writeValue(data);
    // @ts-ignore
    this.phoneForm.patchValue({ phone: this.mask.lastModelValue });
  }
}
