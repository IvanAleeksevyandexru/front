import { Injectable } from '@angular/core';
import { UserSession } from './user-session.type';
import { Subject } from 'rxjs';


@Injectable()
export class UserSessionService {
  private _userId: string;
  private _token: string;

  private userSessionSubject = new Subject<boolean>();
  public userSession$ = this.userSessionSubject.asObservable();

  public setSession(userSession: UserSession): void {
    this._userId = userSession.userId;
    this._token = userSession.token;
    this.userSessionSubject.next();
  }

  public onDestroy() {
    this.userSessionSubject.complete();
  }

  get token (): string {
    return this._token;
  }

  get userId (): string {
    return this._userId;
  }
}
