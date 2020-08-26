import { Component, OnInit, Input } from '@angular/core';
import { ConstructorService } from '../../../services/constructor/constructor.service';
import { PaymentInterface } from '../../screen/components/payment/payment.component';

@Component({
  selector: 'epgu-constructor-redirect',
  template: '',
})
export class RedirectComponent implements OnInit {
  @Input() componentData: PaymentInterface;

  constructor(private constructorService: ConstructorService) {}
  ngOnInit(): void {
    window.location.href = `${this.constructorService.response.scenarioDto.applicantAnswers}`;
  }
}
