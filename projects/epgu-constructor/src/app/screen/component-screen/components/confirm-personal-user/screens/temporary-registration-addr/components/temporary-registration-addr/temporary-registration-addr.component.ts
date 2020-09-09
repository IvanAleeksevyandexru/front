import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm, ValidatorFn, Validators } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../../../../../../../config/config.service';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../../../../../../../services/unsubscribe/unsubscribe.service';
import { TemporaryRegistrationComponent } from '../../temporary-registration-addr-screen.types';
import { DateValidator } from './date-validator';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr',
  templateUrl: './temporary-registration-addr.component.html',
  styleUrls: ['./temporary-registration-addr.component.scss'],
  providers: [UnsubscribeService],
})
export class TemporaryRegistrationAddrComponent implements OnChanges, AfterViewInit {
  forms: any = {};
  @ViewChild('dataForm', { static: false }) dataForm: NgForm;
  @Input() data: TemporaryRegistrationComponent;
  @Input() error: string;
  validationShowOn = ValidationShowOn.IMMEDIATE;

  constructor(
    public configService: ConfigService,
    private componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngAfterViewInit(): void {
    this.subscribeToFormChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      setTimeout(() => {
        this.setValidatorsToForm();
      });
    }
  }

  hintClick(timestamp: number) {
    const currentDayTimestamp = new Date().getTime();
    this.forms.regDate = new Date(currentDayTimestamp + timestamp);
  }

  private formChanges(changesData) {
    this.componentStateService.state = changesData;
  }

  private setValidatorsToForm(): void {
    Object.keys(this.dataForm.controls).forEach((key) => {
      const currentField = this.data.attrs?.fields.find((field) => field.fieldName === key);
      const regExp = currentField?.regexp || null;
      const isRequired = this.data.required;
      const isDateType = currentField?.type === 'date';
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

      this.dataForm.controls[key].setValidators(validators);
    });
  }

  private subscribeToFormChanges(): void {
    this.dataForm.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((changes) => {
      if (this.dataForm.invalid) {
        this.componentStateService.isValid = false;
      } else {
        this.componentStateService.isValid = true;
        this.formChanges(changes);
      }
    });
  }
}
