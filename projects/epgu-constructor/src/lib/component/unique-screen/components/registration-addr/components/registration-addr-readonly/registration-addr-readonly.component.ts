import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { FormControl } from '@angular/forms';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import {
  IRegistrationAddrReadonlyComponent,
  RegistrationAddrFormValue,
} from '../../registration-addr-screen.types';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { CustomComponent } from '../../../../../custom-screen/components-list.types';

@Component({
  selector: 'epgu-constructor-registration-addr-readonly',
  templateUrl: './registration-addr-readonly.component.html',
  styleUrls: ['./registration-addr-readonly.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationAddrReadonlyComponent implements OnInit {
  data$: Observable<IRegistrationAddrReadonlyComponent> = this.screenService
    .component$ as Observable<IRegistrationAddrReadonlyComponent>;

  fullAddress = new FormControl('');
  parsedValue: RegistrationAddrFormValue;
  error: string;

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private changeDetectionRef: ChangeDetectorRef,
    private validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    this.data$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((data) => {
      this.parsedValue = JSON.parse(data?.value || '{}');
      this.fullAddress.setValidators([
        this.validationService.customValidator((data as unknown) as CustomComponent),
      ]);
      this.fullAddress.setValue(this.parsedValue?.regAddr?.fullAddress);
      this.currentAnswersService.state = data.value;
      this.error = this.getError(data);
      this.currentAnswersService.isValid = !!this.fullAddress.value;
      this.changeDetectionRef.markForCheck();
    });
  }

  private getError(data: IRegistrationAddrReadonlyComponent): string {
    const errors = this.screenService?.getStore()?.errors;
    return errors?.[data.id] || this.fullAddress.getError('msg');
  }
}
