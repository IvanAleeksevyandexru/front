import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../../core/services/config/config.service';
import { Observable } from 'rxjs';
import { Referral } from '../medical-referrals-list/medical-referrals-list.types';

@Injectable()
export class ReferralNumberService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  public getRefferalSearch(RefferalNumber: string, SessionId: string): Observable<Referral[]> {
    return this.http.post<Referral[]>(`${this.configService.apiUrl}/lk/v1/equeue/agg/ref/items`, {
      eserviceId: '10000025167',
      parentRefItemValue: null,
      treeFiltering: 'ONELEVEL',
      refName: 'Referral',
      filter: {
        union: {
          unionKind: 'AND',
          subs: [
            {
              simple: {
                attributeName: 'Referral_Number',
                condition: 'EQUALS',
                value: RefferalNumber,
                checkAllValues: true
              }
            },
            {
              simple: {
                attributeName: 'Session_Id',
                condition: 'EQUALS',
                value: SessionId,
                checkAllValues: true
              }
            }
          ]
        }
      }
    });
  }
}
