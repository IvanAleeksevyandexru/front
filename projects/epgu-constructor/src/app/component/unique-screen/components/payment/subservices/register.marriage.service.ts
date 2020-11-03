import { Injectable } from '@angular/core';
import { PaymentSubServices } from '../payment.types';
import { Observable } from 'rxjs';
import { DictionaryApiService } from '../../../../shared/services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ConfigService } from '../../../../../core/config/config.service';
import { PaymentRegisterService } from './register.service';

/**
 * Класс для информации о регистрации брака для оплаты
 */
@Injectable()
export class PaymentRegisterMarriageService extends PaymentRegisterService implements PaymentSubServices{

  constructor(
    public dictionaryApiService: DictionaryApiService,
    public screenService: ScreenService,
    public config: ConfigService,
  ) {
    super(dictionaryApiService, screenService, config);
  }

  /**
   * Загружает информацию из справочников для оплаты
   * @param nsi - код справочника
   * @param attrs - аттрибуты
   */
  loadPaymentInfo(nsi: string, attrs: any): Observable<any> {
    return this.getDictionaryInfo(nsi, attrs);
  }


}
