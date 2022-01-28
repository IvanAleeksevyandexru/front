import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { Observable } from 'rxjs';
import { DictionaryOptions } from '@epgu/epgu-constructor-types';
import { DictionaryResponse } from '../../../../shared/services/dictionary/dictionary-api.types';
import { ScreenService } from '../../../../screen/screen.service';

@Injectable()
export class Smev2TimeSlotsRestService {
  private urlPrefix = this.configService.dictionaryUrl;

  private additionalPath =
    this.screenSerivce.component?.attrs?.dictionaryType || 'getAppointment2_mvdr01';

  constructor(
    private screenSerivce: ScreenService,
    private http: HttpClient,
    private configService: ConfigService,
  ) {}

  public getTimeSlots(requestBody: DictionaryOptions): Observable<DictionaryResponse> {
    const path = `${this.urlPrefix}/${this.additionalPath}`;
    return this.http.post<DictionaryResponse>(path, requestBody, { withCredentials: true });
  }
}
