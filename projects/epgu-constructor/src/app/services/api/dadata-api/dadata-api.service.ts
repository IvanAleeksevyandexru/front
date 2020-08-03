import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryOptionsInterface, DictionaryResponse } from '../../../../interfaces/dictionary-options.interface';
import { ConstructorConfigService } from '../../config/constructor-config.service';
import { CookieService } from 'ngx-cookie-service';
import { UserSessionService } from '../../user-session/user-session.service';
import { Observable } from 'rxjs';

@Injectable()
export class DadataApiService {
  externalApiUrl: string;
  userId: string;
  token: string;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private userSessionService: UserSessionService,
    private cookieService: CookieService
  ) {
    this.externalApiUrl = constructorConfigService.config.externalApiUrl;

    this.userSessionService.userSession$.subscribe(() => {
      this.userId = this.userSessionService.userId;
      this.token = this.userSessionService.token;
      this.cookieService.set('u', this.userId);
      this.cookieService.set('acc_t', this.token);
    });
  }

  getDadataByFias(fiasCode: string) {
    const path = `${this.externalApiUrl}dadata/${fiasCode}`;
    return this.http.get(path);
  }
}
