import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { UserSessionService } from '../user-session/user-session.service';
import { FORM_PLAYER_NAVIGATION } from '../../form-player.types';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class FormPlayerApiService {
  apiUrl: string;
  serviceId: string;
  userId: string;
  token: string;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private userSessionService: UserSessionService,
    private cookieService: CookieService
  ) {
    this.apiUrl = constructorConfigService.config.apiUrl;
    this.serviceId = constructorConfigService.config.serviceId;
    this.userSessionService.userSession$.subscribe(() => {
      this.userId = this.userSessionService.userId;
      this.token = this.userSessionService.token;
      this.cookieService.set('u', this.userId);
      this.cookieService.set('acc_t', this.token);
    });
  }

  public getInitialData() {
    const path = `${this.apiUrl}/getService/${this.serviceId}`;
    return this.http.get<ResponseInterface>(path, {
      withCredentials: false
    });
  }

  public navigate(formPlayerNavigation: FORM_PLAYER_NAVIGATION, data) {
    const path = `${this.apiUrl}/service/${this.serviceId}/scenario/${formPlayerNavigation}`;
    data.scenarioDto.userId = this.userId;
    data.scenarioDto.token = this.token;
    return this.http.post<ResponseInterface>(path, {
      ...data,
    }, {
      withCredentials: false
    });
  }
}
