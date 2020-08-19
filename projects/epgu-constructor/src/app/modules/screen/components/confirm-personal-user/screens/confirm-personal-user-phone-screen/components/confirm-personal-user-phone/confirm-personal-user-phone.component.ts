import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'app-confirm-personal-user-phone',
  templateUrl: './confirm-personal-user-phone.component.html',
  styleUrls: ['./confirm-personal-user-phone.component.scss'],
  providers: [UnsubscribeService],
})
export class ConfirmPersonalUserPhoneComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() data: string;
  @Input() isEditable: boolean;
  @Output() dataChanged = new EventEmitter();

  phoneForm: FormGroup;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  phoneMask = [
    '+',
    /[7]/,
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

  constructor(private formBuilder: FormBuilder, private ngUnsubscribe$: UnsubscribeService) {}

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

    this.phoneForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
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
    }
  }
}
