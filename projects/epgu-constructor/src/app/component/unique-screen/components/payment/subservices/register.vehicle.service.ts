import { Injectable } from '@angular/core';
import { PaymentSubServices } from '../payment.types';
import { Observable } from 'rxjs';
import { DictionaryApiService } from '../../../../shared/services/dictionary-api/dictionary-api.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ConfigService } from '../../../../../core/config/config.service';
import { PaymentRegisterService } from './register.service';

const REQUISITE_STATE_DUTY = 'REQUISITE_STATE_DUTY'; // Код справочника ГИБДД для реквизитов
/**
 * Класс для информации о регистрации транспортного средства для оплаты
 */
@Injectable()
export class PaymentRegisterVehicleService extends PaymentRegisterService implements PaymentSubServices{

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
    return this.getDictionaryInfo(REQUISITE_STATE_DUTY, attrs);
  }
}
