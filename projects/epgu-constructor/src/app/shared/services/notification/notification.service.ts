import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
  private _closeNotificationTime = 20000;

  private _text = new BehaviorSubject<string>(null);
  public get text() {
    return this._text.getValue();
  }
  public set text(val: string) {
    this._text.next(val);
  }

  private _title = new BehaviorSubject<string>(null);
  public get title() {
    return this._title.getValue();
  }
  public set title(val: string) {
    this._title.next(val);
  }

  public hasNotification = new BehaviorSubject<boolean>(false);
  // public get hasNotification() {
  //   return this._hasNotification.getValue();
  // }
  // public set hasNotification(val: boolean) {
  //   this._hasNotification.next(val);
  // }

  setNotification(text: string, title: string = 'Предупреждение') {
    this.text = text;
    this.title = title;
    this.hasNotification.next(true);

    setTimeout(() => this.close(), this._closeNotificationTime);
  }

  close() {
    this.hasNotification.next(false);
  }
}
