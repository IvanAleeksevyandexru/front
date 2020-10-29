import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class NotificationService {
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

  private _hasNotification = new BehaviorSubject<boolean>(null);
  public get hasNotification() {
    return this._hasNotification.getValue();
  }
  public set hasNotification(val: boolean) {
    this._hasNotification.next(val);
  }

  setNotification(text: string, title: string = 'Предупреждение') {
    this.text = text;
    this.title = title;
    this.hasNotification = true;
  }

  close() {
    this.hasNotification = false;
  }
}
