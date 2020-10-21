import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../config/config.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../../../current-answers.service';
import { TemporaryRegistrationComponent } from '../../temporary-registration-addr-screen.types';
import { DateValidator } from './date-validator';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
  providers: [UnsubscribeService],
})
export class TemporaryRegistrationAddrComponent implements OnInit {
  @Input() data: TemporaryRegistrationComponent;
  @Input() error: string;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  redAddrForm: FormGroup;

  constructor(
    public config: ConfigService,
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToFormChanges();
  }

  initFormGroup(): void {
    const controls = {};
    this.data?.attrs?.fields.forEach((field) => {
      controls[field.fieldName] = this.fb.control(null, this.getValidatorsForField(field));
    });
    this.redAddrForm = this.fb.group(controls);
  }

  hintClick(timestamp: number) {
    const currentDayTimestamp = new Date().getTime();
    this.redAddrForm.patchValue({ regDate: new Date(currentDayTimestamp + timestamp) });
  }

  private getValidatorsForField(field): ValidatorFn[] {
    const regExp = field?.regexp || null;
    const isRequired = this.data.required;
    const isDateType = field?.type === 'date';
    const validators: Array<ValidatorFn> = [];
    if (regExp) {
      validators.push(Validators.pattern(regExp));
    }

    if (isDateType) {
      validators.push(DateValidator.date);
    }

    if (isRequired) {
      validators.push(Validators.required);
    }

    return validators;
  }

  private subscribeToFormChanges(): void {
    this.redAddrForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((changes) => {
      if (this.redAddrForm.invalid) {
        this.currentAnswersService.isValid = false;
      } else {
        this.currentAnswersService.isValid = true;
        this.currentAnswersService.state = changes;
      }
    });
  }
}
