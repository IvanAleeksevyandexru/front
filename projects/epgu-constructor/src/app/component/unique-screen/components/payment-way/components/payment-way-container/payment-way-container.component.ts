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
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { PaymentWayComponentAttrsDto } from '../../payment-way.types';

@Component({
  selector: 'epgu-constructor-payment-way-container',
  templateUrl: './payment-way-container.component.html',
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
      .pipe(startWith(''), takeUntil(this.ngUnsubscribe$))
      .subscribe((change) => this.setState(change));

    this.cdr.detectChanges();
  }

  private init({ value, required, attrs }: ComponentDto): void {
    const { paymentWay } = <PaymentWayComponentAttrsDto>attrs;
    const isNeedSelected = !value && paymentWay.length === 1;
    this.paymentWayControl.setValue(isNeedSelected ? paymentWay[0].paymentType : value);
    if (required) {
      this.paymentWayControl.setValidators(Validators.required);
    }
  }

  private setState(change: string): void {
    this.currentAnswersService.state = change;
    this.currentAnswersService.isValid = this.paymentWayControl.valid;
  }
}
