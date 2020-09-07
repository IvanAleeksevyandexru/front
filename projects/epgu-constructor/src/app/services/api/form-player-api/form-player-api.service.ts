import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseInterface } from './form-player-api.types';
import { ConfigService } from '../../../config/config.service';
import { UserSessionService } from '../../user-session/user-session.service';
import { FormPlayerNavigation } from '../../../form-player.types';

@Injectable()
export class FormPlayerApiService {
  apiUrl: string;
  userId: string;
  token: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private userSessionService: UserSessionService,
  ) {
    this.apiUrl = configService.config.apiUrl;
    this.userSessionService.userSession$.subscribe(() => {
      this.userId = this.userSessionService.userId;
      this.token = this.userSessionService.token;
    });
  }

  public getInitialData(serviceId: string) {
    const path = `${this.apiUrl}/getService/${serviceId}`;
    return this.http.get<ResponseInterface>(path, {
      withCredentials: false
    });
  }

  public navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, data) {
    const path = `${this.apiUrl}/service/${serviceId}/scenario/${formPlayerNavigation}`;
    data.scenarioDto.userId = this.userId;
    data.scenarioDto.token = this.token;
    return this.http.post<ResponseInterface>(path, {
      ...data,
    }, {
      withCredentials: false
    });
  }
}
