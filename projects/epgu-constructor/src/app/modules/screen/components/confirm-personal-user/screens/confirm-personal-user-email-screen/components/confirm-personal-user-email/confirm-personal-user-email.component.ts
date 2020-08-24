import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { delay, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { ScreenComponentService } from '../../../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-email',
  templateUrl: './confirm-personal-user-email.component.html',
  styleUrls: ['./confirm-personal-user-email.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserEmailComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() error: string;
  @Input() isEditable: boolean;
  @Input() isEditButtonShown: boolean;
  @Output() dataChanged = new EventEmitter();

  emailForm: FormGroup;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    private formBuilder: FormBuilder,
    private ngUnsubscribe$: UnsubscribeService,
    private screenComponentService: ScreenComponentService,
  ) {}

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: this.formBuilder.control(
        {
          value: this.data || '',
          disabled: !this.isEditable,
        },
        {
          validators: Validators.compose([Validators.required, Validators.email]),
        },
      ),
    });

    this.emailForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$), delay(0))
      .subscribe((change) => {
        const { email } = change;
        this.screenComponentService.dataToSend = email;
        this.screenComponentService.isValid = this.emailForm.valid;
        this.dataChanged.emit(change);
      });
  }

  ngOnChanges(): void {
    if (this.emailForm) {
      if (this.isEditable) {
        this.emailForm.controls.email.enable();
      } else {
        this.emailForm.controls.email.disable();
      }

      if (this.error) {
        this.emailForm.controls.email.setErrors({ incorrect: true });
        this.emailForm.controls.email.enable();
      } else {
        this.emailForm.controls.email.setErrors(null);
      }
    }
  }

  handleClick() {
    this.emailForm.controls.email.enable();
  }
}
