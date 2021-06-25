import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AppNavigationService,
  AppStateQuery,
  AppStateService,
} from '@epgu/epgu-constructor-ui-kit';
import { FinancialSourceType, Group, Program } from '../../../../typings';
import { ChildrenClubsState, ChildrenClubsValue } from '../../../../children-clubs.types';

@Component({
  selector: 'children-clubs-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupItemComponent {
  @Input() set data(data: Group) {
    this.group = data;
    data?.financingTypes?.forEach((item) => {
      this.sources[item.sourceCode] = item?.monthlyCost ?? null;
    });
    this.isPayments =
      !this.sources[FinancialSourceType.none] && !this.sources[FinancialSourceType.budget];

    this.certCost = this.sources[FinancialSourceType.pfdod_certificate];
    this.paidCost =
      this.sources[FinancialSourceType.paid] || this.sources[FinancialSourceType.private];
    this.initMultiPayments();
    this.initPaymentMethods();
    // нужно узнать есть ли вообще платежи
    // нужно узнать несколько или 1
    // сделать текст
    // вывести cost
  }
  @Input() program: Program;
  @Input() index: number;

  paymentMethodsMap: Record<string, string> = {
    budget: 'бесплатно',
    cert: 'сертификатом',
    paid: 'из личных средств',
  };
  payments = '';
  certCost?: number;
  paidCost?: number;
  sources: Record<string, number> = {};
  isPayments = false;
  isMutliPayments = false;
  group: Group;
  sourceType = FinancialSourceType;

  constructor(
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private appNavigationService: AppNavigationService,
  ) {}

  initPaymentMethods(): void {
    const payments: string[] = [];
    if (this.sources[FinancialSourceType.budget]) {
      payments.push(this.paymentMethodsMap.budget);
    }
    if (this.sources[FinancialSourceType.pfdod_certificate]) {
      payments.push(this.paymentMethodsMap.cert);
    }
    if (
      this.sources[FinancialSourceType.private] > 0 ||
      this.sources[FinancialSourceType.paid] > 0
    ) {
      payments.push(this.paymentMethodsMap.paid);
    }

    const result = payments.join(' или ');
    this.payments = result[0].toUpperCase() + result.slice(1);
  }

  initMultiPayments(): void {
    if (this.isPayments) {
      const paid =
        this.sources[FinancialSourceType.paid] || this.sources[FinancialSourceType.private];
      const cert = this.sources[FinancialSourceType.pfdod_certificate];
      if (paid > 0 && cert > 0 && paid !== cert) {
        this.isMutliPayments = true;
      }
    }
  }
  finish(): void {
    const result = {};
    this.appStateService.updateValue({ ...this.stateQuery.value, ...result });
    this.appNavigationService.next();
  }
}
