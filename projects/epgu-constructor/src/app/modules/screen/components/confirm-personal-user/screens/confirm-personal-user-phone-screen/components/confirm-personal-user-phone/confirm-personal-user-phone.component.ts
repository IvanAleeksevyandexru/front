import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { delay, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserPhoneComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() error: string;
  @Input() isEditButtonShown: boolean;
  @Output() dataChanged = new EventEmitter();

  isEditable: boolean;
  phoneForm: FormGroup;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
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
          disabled: !this.isEditable,
        },
        {
          validators: Validators.compose([Validators.required, Validators.minLength(18)]),
        },
      ),
    });

    this.phoneForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), delay(0))
      .subscribe((change) => {
        let { phone } = change;
        phone = phone.replace(/[\s|-]+/g, ''); // backend-friendly format +7(999)1234567
        this.componentStateService.state = phone;
        this.componentStateService.isValid = this.phoneForm.valid;
        this.dataChanged.emit(change);
      });
  }

  ngOnChanges(): void {
    if (this.phoneForm) {
      if (this.isEditable) {
        this.phoneForm.controls.phone.enable();
      } else {
        this.phoneForm.controls.phone.disable();
      }

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
  }
}
