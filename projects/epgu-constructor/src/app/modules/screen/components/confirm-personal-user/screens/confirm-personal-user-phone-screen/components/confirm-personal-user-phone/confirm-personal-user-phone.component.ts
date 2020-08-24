import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { delay, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ScreenComponentService } from '../../../../../../service/screen-component/screen-component.service';

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
  @Input() isEditable: boolean;
  @Input() isEditButtonShown: boolean;
  @Output() dataChanged = new EventEmitter();

  phoneForm: FormGroup;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  phoneMask = ['+', /[7]/, '(', /[1-9]/, /\d/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(
    private formBuilder: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private screenComponentService: ScreenComponentService,
  ) {}

  ngOnInit(): void {
    this.phoneForm = this.formBuilder.group({
      phone: this.formBuilder.control(
        {
          value: this.data || '',
          disabled: !this.isEditable,
        },
        {
          validators: Validators.compose([Validators.required, Validators.minLength(14)]),
        },
      ),
    });

    this.phoneForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), delay(0))
      .subscribe((change) => {
        const { phone } = change;
        this.screenComponentService.dataToSend = phone;
        this.screenComponentService.isValid = this.phoneForm.valid;
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
