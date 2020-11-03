import { Injectable } from '@angular/core';
import { PaymentService } from '../../payment.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


/**
 * Сервис для оплаты услуг пользователем
 */
@Injectable()
export class InvoiceService extends PaymentService {

  /**
   * Возвращает квитанцию на оплату
   *
   * @param billId - уникальный идентификатор патежа
   */
  getInvoice(billId: number) {
    const urlPrefix = this.config.mocks.includes('payment')
      ? `${this.config.mockUrl}/pay/v1/bill/get/pdf`
      : `${this.config.billsApiUrl}bill/get/pdf`;

    const path = `${urlPrefix}/?billIds=${billId}`;
    return this.http.post(path, {}, this.requestOptions).pipe(
      catchError((err: any) => {
        return throwError(err);
      })
    );
  }
}
