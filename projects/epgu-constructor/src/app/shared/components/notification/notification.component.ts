import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { NotificationService } from '../../services/notification/notification.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [UnsubscribeService],
})
export class NotificationComponent implements OnInit {
  constructor(
    public notificationService: NotificationService,
    private cdk: ChangeDetectorRef,
    private unsubscribeService$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.notificationService.hasNotification$
      .pipe(takeUntil(this.unsubscribeService$))
      .subscribe(() => {
        this.cdk.detectChanges();
      });
  }
}
