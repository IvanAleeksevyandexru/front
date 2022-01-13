import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  MicroAppStateQuery,
  MicroAppStateService,
  DATE_STRING_DASH_FORMAT,
  DATE_STRING_DOT_FORMAT,
  DatesToolsService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { NEXT_STEP_ACTION } from '../../../../../../../../shared/constants/actions';
import { ActionService } from '../../../../../../../../shared/directives/action/action.service';
import {
  Group,
  FinancialSourceType,
  Program,
  DenyReasonMessage,
  ChildrenClubsValue,
  ChildrenClubsState,
  ValueProgram,
  ValueGroup,
  FinancialSource,
} from '../../../../models/children-clubs.types';

@Component({
  selector: 'epgu-constructor-cc-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss', '../../../../../../../../../styles/index.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupItemComponent implements OnInit {
  @Input() set data(data: Group) {
    this.group = data;
    data?.financingSources?.forEach((item) => {
      this.sources[item.sourceCode] = this.getCost(item) ?? null;
      this.resultSources[item.sourceCode] = true;
    });
    this.available = data?.available ?? true;

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
  isMultiPaymentsInfoShown = false;
  group: Group;
  available: boolean;
  sourceType = FinancialSourceType;
  denyReasonMessage: DenyReasonMessage | null = null;
  isNextSchoolYear: boolean;

  constructor(
    private appStateService: MicroAppStateService<ChildrenClubsValue, ChildrenClubsState>,
    private stateQuery: MicroAppStateQuery<ChildrenClubsValue, ChildrenClubsState>,
    private actionService: ActionService,
    private currentAnswersService: CurrentAnswersService,
    private dateToolService: DatesToolsService,
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.setIsNextSchoolYear();
    this.getDenyReasonMessage();
  }

  setPaymentMethodsInfo(): void {
    let paymentInfoText;

    const payments: string[] = [];
    if (
      this.sources[FinancialSourceType.budget] === 0 ||
      this.sources[FinancialSourceType.none] === 0
    ) {
      payments.push(this.paymentMethodsMap.budget);
    }
    if (this.sources[FinancialSourceType.pfdod_certificate] >= 0) {
      payments.push(this.paymentMethodsMap.cert);
    }
    if (
      this.sources[FinancialSourceType.private] >= 0 ||
      this.sources[FinancialSourceType.paid] >= 0
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
    const paid =
      this.sources[FinancialSourceType.paid] || this.sources[FinancialSourceType.private];
    const cert = this.sources[FinancialSourceType.pfdod_certificate];
    if (paid >= 0 && cert >= 0 && paid !== cert) {
      this.isMultiPaymentsInfoShown = true;
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
      partnerPhone: this.program?.partnerPhone,
      site: this.program?.site,
      pfdodRulesLink: this.program?.pfdodRulesLink,
    };

    const group: ValueGroup = {
      groupGUID: this.group.uuid,
      name: this.group?.name,
      dateBegin: this.group?.dateBegin,
      dateEnd: this.group?.dateEnd,
      financialSourceBudget: this.sources,
      financialSource: this.resultSources,
      orderFrom: this.group?.orderFrom,
      orderTo: this.group?.orderTo,
      availableNextYearOrderFrom: this.group?.availableNextYearOrderFrom,
      availableNextYearOrderTo: this.group?.availableNextYearOrderTo,
    };
    const result: ChildrenClubsValue = { datasource: this.program?.datasource, program, group };
    const componentId = this.screenService.component.id;

    this.appStateService.updateValue({ ...this.stateQuery.value, ...result });
    this.currentAnswersService.isValid = true;
    this.currentAnswersService.state = JSON.stringify({ ...result });

    this.actionService.switchAction(NEXT_STEP_ACTION, componentId);
  }

  private getCost(item: FinancialSource): number {
    return item.sourceCode === FinancialSourceType.pfdod_certificate ? item.monthlyCost : item.cost;
  }

  private getDenyReasonMessage(): void {
    try {
      if (this.group && !(this.group.available ?? true) && this.group.denyReason) {
        const { denyReason } = this.group;
        const { denyReason: denyReasonJSON } = this.stateQuery.state;
        const denyReasonsByPeriod = JSON.parse(denyReasonJSON);
        const denyReasonMessage: DenyReasonMessage | null =
          (this.isNextSchoolYear
            ? denyReasonsByPeriod.nextYear[denyReason]
            : denyReasonsByPeriod.currentYear[denyReason]) || null;
        if (denyReasonMessage) {
          this.denyReasonMessage = {
            text: this.getReplacedDenyReasonMessageStr(denyReasonMessage.text),
            title: this.getReplacedDenyReasonMessageStr(denyReasonMessage.title),
          };
        }
      }
    } catch (e) {
      this.denyReasonMessage = null;
    }
  }

  private getReplacedDenyReasonMessageStr(str: string): string {
    if (!this.group) {
      return str;
    }
    const {
      dateEnd,
      dateBegin,
      orderTo,
      orderFrom,
      availableNextYearOrderFrom,
      availableNextYearOrderTo,
    } = this.group;
    return str
      .replace(/\$\{orderFrom\}?/g, this.formatDateToReplaceInDenyReason(orderFrom))
      .replace(/\$\{orderTo\}?/g, this.formatDateToReplaceInDenyReason(orderTo))
      .replace(/\$\{dateBegin\}?/g, this.formatDateToReplaceInDenyReason(dateBegin))
      .replace(/\$\{dateEnd\}?/g, this.formatDateToReplaceInDenyReason(dateEnd))
      .replace(
        /\$\{availableNextYearOrderFrom\}?/g,
        this.formatDateToReplaceInDenyReason(availableNextYearOrderFrom),
      )
      .replace(
        /\$\{availableNextYearOrderTo\}?/g,
        this.formatDateToReplaceInDenyReason(availableNextYearOrderTo),
      );
  }

  private formatDateToReplaceInDenyReason(date: string | null): string {
    return date
      ? this.dateToolService.format(
          this.dateToolService.parse(date, DATE_STRING_DASH_FORMAT),
          DATE_STRING_DOT_FORMAT,
        )
      : '';
  }

  private setIsNextSchoolYear(): void {
    this.isNextSchoolYear = this.stateQuery.state.nextSchoolYear === 'true';
  }
}
