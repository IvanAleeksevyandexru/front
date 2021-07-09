import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AppNavigationService,
  AppStateQuery,
  AppStateService,
} from '@epgu/epgu-constructor-ui-kit';
import { FinancialSource, FinancialSourceType, Group, Program } from '../../../../typings';
import {
  ChildrenClubsState,
  ChildrenClubsValue,
  ValueGroup,
  ValueProgram,
} from '../../../../children-clubs.types';

@Component({
  selector: 'children-clubs-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss', '../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupItemComponent {
  @Input() set data(data: Group) {
    this.group = data;
    data?.financingSources?.forEach((item) => {
      this.sources[item.sourceCode] = this.getCost(item) ?? null;
      this.resultSources[item.sourceCode] = true;
    });
    this.isPayments =
      !this.sources[FinancialSourceType.none] && !this.sources[FinancialSourceType.budget];

    this.certCost = this.sources[FinancialSourceType.pfdod_certificate];
    this.paidCost =
      this.sources[FinancialSourceType.paid] || this.sources[FinancialSourceType.private];
    this.initMultiPayments();
    this.setPaymentMethodsInfo();
  }
  @Input() program: Program;
  @Input() index: number;

  paymentMethodsMap: Record<string, string> = {
    budget: 'бесплатно',
    cert: 'сертификатом',
    paid: 'из личных средств',
  };
  paymentsInfo = '';
  certCost?: number;
  paidCost?: number;
  sources: Record<string, number> = {};
  resultSources: Record<string, boolean> = {
    none: false,
    budget: false,
    pfdod_certificate: false,
    paid: false,
    private: false,
  };
  isPayments = false;
  isMutliPayments = false;
  group: Group;
  sourceType = FinancialSourceType;

  constructor(
    private appStateService: AppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: AppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private appNavigationService: AppNavigationService,
  ) {}

  setPaymentMethodsInfo(): void {
    let paymentInfoText;

    const payments: string[] = [];
    if (
      this.sources[FinancialSourceType.budget] === 0 ||
      this.sources[FinancialSourceType.none] === 0
    ) {
      payments.push(this.paymentMethodsMap.budget);
    }
    if (this.sources[FinancialSourceType.pfdod_certificate] > 0) {
      payments.push(this.paymentMethodsMap.cert);
    }
    if (
      this.sources[FinancialSourceType.private] > 0 ||
      this.sources[FinancialSourceType.paid] > 0
    ) {
      payments.push(this.paymentMethodsMap.paid);
    }

    if (payments.length === 1) {
      paymentInfoText = payments.pop();
    } else if (payments.length > 0) {
      const lastPayment = payments.pop();
      paymentInfoText = `${payments.join(', ')} или ${lastPayment}`;
    }

    this.paymentsInfo = paymentInfoText
      ? paymentInfoText[0]?.toUpperCase() + paymentInfoText.slice(1)
      : '';
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
    const program: ValueProgram = {
      name: this.program?.name,
      typeOfBudget: this.program?.typeOfBudget,
      fiasMunicipal: this.program?.municipal?.uuid,
      municipalityName: this.program?.municipal?.name,
      regionName: this.program?.region?.name,
      fiasRegion: this.program?.region?.uuid,
    };

    const group: ValueGroup = {
      groupGUID: this.group.uuid,
      name: this.group?.name,
      dateBegin: this.group?.dateBegin,
      dateEnd: this.group?.dateEnd,
      financialSourceBudget: this.sources,
      financialSource: this.resultSources,
    };
    const result: ChildrenClubsValue = { datasource: this.program?.datasource, program, group };

    this.appStateService.updateValue({ ...this.stateQuery.value, ...result });
    this.appNavigationService.next();
  }

  private getCost(item: FinancialSource): number {
    return item.sourceCode === FinancialSourceType.pfdod_certificate ? item.monthlyCost : item.cost;
  }
}
