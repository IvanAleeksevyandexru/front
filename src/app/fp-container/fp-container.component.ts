import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AppService } from '../app.service';
import { UnsubscribeService } from '../../../projects/epgu-constructor/src/app/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'fp-container',
  templateUrl: './fp-container.component.html',
  styleUrls: ['./fp-container.component.scss'],
})
export class FpContainerComponent implements OnInit {
  serviceId: string;
  targetId: string;
  orderId: string;

  constructor(private appService: AppService, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit() {
    this.appService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((config) => {
      this.serviceId = config.serviceId;
      this.targetId = config.targetId;
      this.orderId = config.orderId;
    });
  }
}
