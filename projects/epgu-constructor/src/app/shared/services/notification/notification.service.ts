import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
  private _closeNotificationTime = 20000;

  private _text$ = new BehaviorSubject<string>(null);
  public get text() {
    return this._text$.getValue();
  }
  public set text(val: string) {
    this._text$.next(val);
  }

  private _title$ = new BehaviorSubject<string>(null);
  public get title() {
    return this._title$.getValue();
  }
  public set title(val: string) {
    this._title$.next(val);
  }

  public hasNotification$ = new BehaviorSubject<boolean>(false);

  private _timerId: any;

  public setNotification(text: string, title: string = 'Предупреждение'): void {
    this.text = text;
    this.title = title;
    this.open();

    if (!this._timerId) {
      this._timerId = setTimeout(() => this.close(), this._closeNotificationTime);
    } else {
      this._timerId = null;
      this.close();
      this._timerId = setTimeout(() => this.close(), this._closeNotificationTime);
    }
  }

  public close(): void {
    this.hasNotification$.next(false);
  }

  public open(): void {
    this.hasNotification$.next(true);
  }
}
