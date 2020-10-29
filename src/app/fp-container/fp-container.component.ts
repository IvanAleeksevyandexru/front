import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AppService } from '../app.service';
import { UnsubscribeService } from '../../../projects/epgu-constructor/src/app/shared/services/unsubscribe/unsubscribe.service';
import { Service } from '../../../projects/epgu-constructor/src/app/form-player/form-player.types';

@Component({
  selector: 'fp-container',
  templateUrl: './fp-container.component.html',
  styleUrls: ['./fp-container.component.scss'],
})
export class FpContainerComponent implements OnInit {
  service: Service;

  constructor(private appService: AppService, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit() {
    this.appService.config$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((config) => {
      this.service = {
        serviceId: config.serviceId,
        targetId: config.targetId,
        orderId: config.orderId,
        invited: config.invited,
        canStartNew: config.canStartNew,
      };
    });
  }
}
