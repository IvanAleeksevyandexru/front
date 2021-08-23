import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Notifier, NotifierType } from '../../components/disclaimer/notifier/notifier.model';

@Injectable({ providedIn: 'root' })
export class NotifierDisclaimerService {
  public notifier$: Observable<Notifier>;

  private subject = new Subject<Notifier>();

  constructor() {
    this.notifier$ = this.subject.asObservable();
  }

  public open(config): void {
    this.notifier(
      new Notifier({
        title: config.title,
        message: config.message,
        type: config.type as NotifierType,
        notifierId: config.notifierId,
        onCancel: config.onCancel,
        onAction: config.onAction,
        actionName: config.actionName,
        showIcon: config.showIcon,
      }),
    );
  }

  public notifier(notifier: Notifier): void {
    this.subject.next(notifier);
  }
}
