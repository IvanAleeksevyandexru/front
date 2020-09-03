import { Injectable } from '@angular/core';
import { UserSession } from './user-session.type';


@Injectable()
export class UserSessionService {
  private _userId: string;
  private _token: string;

  public setSession(userSession: UserSession): void {
    this._userId = userSession.userId;
    this._token = userSession.token;
  }

  get token (): string {
    return this._token;
  }

  get userId (): string {
    return this._userId;
  }
}
