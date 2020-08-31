import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Subscription, throwError, Observable } from 'rxjs';
/* eslint-disable import/no-extraneous-dependencies */
import { catchError, switchMap, map, takeUntil } from 'rxjs/operators';
import { ComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { RestService } from '../../../../services/rest/rest.service';
import { ConstructorConfigService } from '../../../../services/config/constructor-config.service';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import {
  PaymentAttrsInterface,
  PaymentInfoInterface,
  PaymentDictionaryOptionsInterface,
} from '../../../../../interfaces/payment.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { PaymentStatus } from './enums/payment-status.enum';

export interface PaymentInterface extends ComponentInterface {
  attrs: PaymentAttrsInterface;
}
@Component({
  selector: 'epgu-constructor-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [UnsubscribeService],
})
export class PaymentComponent implements OnInit {
  public paymentStatus = PaymentStatus;
  public status: PaymentStatus;
  public loadPaymentInfoSub: Subscription;
  public uin: string;
  public sum: string;
  public document: string;
  // @Input() data: PaymentInterface;
  @Input() data: PaymentInterface;
  private apiUrl: string;
  private externalUrl: string;
  private mockUinCode = '18810177200104519116';
  private mockOrderId = '763419899';

  constructor(
    private restService: RestService,
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private screenComponentService: ScreenComponentService,
    private ngUnsubscribe$: UnsubscribeService,
    public constructorService: ConstructorService,
  ) {
    this.apiUrl = this.constructorConfigService.config.apiUrl;
    this.externalUrl = this.constructorConfigService.config.externalUrl;
  }

  ngOnInit(): void {
    this.loadPaymentInfo()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (res: any) => {
          this.status = PaymentStatus.SUCCESS;
          this.uin = res.value.replace('PRIOR', '');
          this.screenComponentService.dataToSend = this.getPaymentLink();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 500) {
            this.status = PaymentStatus.ERROR;
          } else {
            console.log(error);
            this.status = PaymentStatus.SERVER_ERROR;
          }
        },
      );
  }

  loadPaymentInfo() {
    const dictionaryOptions = this.createPaymentRequestOptions();
    const { nsi } = this.data.attrs;
    return this.restService.getDictionary(nsi, dictionaryOptions).pipe(
      map((res: any) => {
        if (res.error.code === 0) {
          return res.items[0].attributeValues;
        }
        throw Error();
      }),
      switchMap((attributeValues: PaymentInfoInterface) => {
        this.sum = this.transformSum(attributeValues);
        return this.getUin(attributeValues);
      }),
      catchError((err: any) => {
        return throwError(err);
      }),
    );
  }

  getPaymentLink() {
    // TODO хардкод. доделать.
    // eslint-disable-next-line prettier/prettier
    return `https://payment-dev-l14.test.gosuslugi.ru/?billNumber=${this.uin}&returnUrl=${encodeURIComponent(this.apiUrl,)}&subscribe=true`;
  }

  getUin(attributeValues: PaymentInfoInterface): Observable<any> {
    const options = { withCredentials: true };
    return this.http.post(
      `${this.externalUrl}api/lk/v1/paygate/uin/1?orderId=${this.mockOrderId}`,
      attributeValues,
      options,
    );
    // return of({ value: this.mockUinCode });
  }

  createPaymentRequestOptions(): PaymentDictionaryOptionsInterface {
    const { applicantAnswers }: any = this.constructorService.response.scenarioDto;
    // eslint-disable-next-line prettier/prettier
    const filterReg = JSON.parse(applicantAnswers.ms1.value);
    // TODO хардкод. доделать.
    return {
      pageSize: '258',
      filter: {
        union: {
          unionKind: 'AND',
          subs: [
            {
              simple: {
                attributeName: 'FiasCode',
                condition: 'EQUALS',
                value: { asString: filterReg.value.substring(0, 3) },
              },
            },
            {
              simple: {
                attributeName: 'filter_reg',
                condition: 'EQUALS',
                value: { asString: filterReg.value },
              },
            },
            {
              simple: {
                attributeName: 'dictem_code',
                condition: 'EQUALS',
                value: { asString: this.data.attrs.dictItemCode },
              },
            },
          ],
        },
      },
      tx: '41588125-d55f-11ea-8b86-fa163ee4b849',
    };
  }

  transformSum(attributeValues): string {
    return attributeValues.sum.padStart(3, '0').replace(/\d{2}$/, ',$&');
  }
}
