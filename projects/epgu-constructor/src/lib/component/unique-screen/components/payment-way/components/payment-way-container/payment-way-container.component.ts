import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { PaymentWayComponentAttrsDto } from '../../payment-way.types';

@Component({
  selector: 'epgu-constructor-payment-way-container',
  templateUrl: './payment-way-container.component.html',
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentWayContainerComponent implements OnInit, AfterViewInit {
  paymentWayControl = new FormControl('');

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.screenService.component$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((cmp) => this.init(cmp));
  }

  ngAfterViewInit(): void {
    this.paymentWayControl.valueChanges
      .pipe(startWith(this.paymentWayControl.value), takeUntil(this.ngUnsubscribe$))
      .subscribe((change) => this.setState(change));

    this.cdr.detectChanges();
  }

  private init({ value, required, attrs }: ComponentDto): void {
    const { paymentWays } = <PaymentWayComponentAttrsDto>attrs;
    const isNeedSelected = !value && paymentWays.length === 1;
    this.paymentWayControl.setValue(isNeedSelected ? paymentWays[0].paymentType : value);
    if (required) {
      this.paymentWayControl.setValidators(Validators.required);
      this.paymentWayControl.updateValueAndValidity();
    }
  }

  private setState(change: string): void {
    this.currentAnswersService.state = change;
    this.currentAnswersService.isValid = this.paymentWayControl.valid;
  }
}
