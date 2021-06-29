import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HealthService } from '@epgu/epgu-lib';
import { ScreenService } from '../../../screen/screen.service';
import { SuggestActions, FieldTypes } from '../../constants/suggest';

@Injectable()
export class SuggestMonitorService {

  constructor (private cookie: CookieService, private health: HealthService, private screen: ScreenService) {}

  public handleAutocompleteEvent(event: SuggestActions, fieldType: FieldTypes, params: object = {}): void {
    this.health.measureStart(event);
    this.health.measureEnd(event, 0, {
      suggestField: this.getAdditionalFieldId() + fieldType,
      userId: this.cookie.get('u'),
      ...params,
    });
  }

  private getAdditionalFieldId(): string {
    const store = this.screen.getStore();
    const serviceCode = store?.serviceCode ?? 'COMMON';
    const screenId = store?.display?.id ?? 'ID';

    return `${serviceCode}_${screenId}_`;
  }
}
