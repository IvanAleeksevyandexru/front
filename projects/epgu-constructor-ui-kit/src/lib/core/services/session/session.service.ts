import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

type CookieSession = { userId: string };

@Injectable()
export class SessionService {
  private _userId: string;

  constructor(private cookieService: CookieService) {
    this.init();
  }

  get userId(): string {
    return this._userId;
  }

  get disableUnderConstructionMode(): string {
    return this.cookieService.get('disableUnderConstructionMode');
  }

  private init(): void {
    this._userId = this.getSessionFromCookie().userId;
  }

  private getSessionFromCookie(): CookieSession {
    const userId = this.cookieService.get('u') || '';
    return { userId };
  }
}
