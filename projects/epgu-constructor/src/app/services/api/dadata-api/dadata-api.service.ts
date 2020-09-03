import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstructorConfigService } from '../../config/constructor-config.service';
import { UserSessionService } from '../../user-session/user-session.service';

@Injectable()
export class DadataApiService {
  externalApiUrl: string;
  userId: string;
  token: string;

  constructor(
    private http: HttpClient,
    private constructorConfigService: ConstructorConfigService,
    private userSessionService: UserSessionService,
  ) {
    this.externalApiUrl = constructorConfigService.config.externalApiUrl;

    this.userSessionService.userSession$.subscribe(() => {
      this.userId = this.userSessionService.userId;
      this.token = this.userSessionService.token;
    });
  }

  getDadataByFias(fiasCode: string) {
    const path = `${this.externalApiUrl}dadata/${fiasCode}`;
    return this.http.get(path);
  }
}
