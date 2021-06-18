import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryConditions, DictionaryValueTypes } from '@epgu/epgu-constructor-types';
import { HttpClient } from '@angular/common/http';
import { IGetReferralResponseDto } from './referral-number-dto.interface';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

@Injectable()
export class ReferralNumberService {
  private endpoint = 'v1/equeue/agg/ref/items';

  constructor(
    private dictionaryToolsService: DictionaryToolsService,
    private http: HttpClient,
    private config: ConfigService,
    public screenService: ScreenService,
  ) {}

  public getReferralSearch(referralNumber: string, sessionId: string, eserviceId: string): Observable<IGetReferralResponseDto> {
    const filter = this.dictionaryToolsService.getFilterOptions({}, this.screenService.getStore(), [
      {
        attributeName: 'Referral_Number',
        condition: DictionaryConditions.EQUALS,
        value: JSON.stringify(referralNumber),
        checkAllValues: true,
        valueType: DictionaryValueTypes.value,
      },
      {
        attributeName: 'Session_Id',
        condition: DictionaryConditions.EQUALS,
        value: JSON.stringify(sessionId),
        checkAllValues: true,
        valueType: DictionaryValueTypes.value,
      },
    ]);

    return this.http.post<IGetReferralResponseDto>(
      `${this.config.lkApi}/${this.endpoint}`,
      {
        eserviceId,
        parentRefItemValue: null,
        treeFiltering: 'ONELEVEL',
        refName: 'Referral',
        filter: filter.filter,
      },
      { withCredentials: true },
    );
  }
}
