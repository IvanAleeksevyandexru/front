import { Component, OnInit, Input } from '@angular/core';
import { ConstructorService } from '../../../services/constructor/constructor.service';
import { ComponentInterface } from '../../../../interfaces/epgu.service.interface';
import { PaymentScenarioInterface } from '../../../../interfaces/payment.interface';

/**
 * Модуль для редиректа на сервис онлайн оплаты
 */
@Component({
  selector: 'epgu-constructor-redirect',
  template: '',
})
export class RedirectComponent implements OnInit {
  @Input() componentData: ComponentInterface;

  constructor(private constructorService: ConstructorService) {}

  ngOnInit(): void {
    const applicantAnswers: PaymentScenarioInterface = this.constructorService.response.scenarioDto;
    window.location.href = applicantAnswers.applicantAnswers.pay1.value;
  }
}
