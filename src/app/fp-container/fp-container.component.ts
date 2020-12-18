import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Service } from '../../../projects/epgu-constructor/src/app/form-player/form-player.types';

@Component({
  selector: 'fp-container',
  templateUrl: './fp-container.component.html',
  styleUrls: ['./fp-container.component.scss'],
})
export class FpContainerComponent {
  service$: Observable<Service> = this.appService.config$.pipe(
    map((config) => {
      const service: Service = {
        serviceId: config.serviceId,
        targetId: config.targetId,
        orderId: config.orderId,
        invited: config.invited,
        apiUrl: config.apiUrl,
        canStartNew: config.canStartNew,
        initState: config.initState,
      };

      if (typeof config.invited === 'string' && config.invited === '') {
        delete service.invited;
      }

      if (!config.apiUrl) {
        delete service.apiUrl;
      }

      if (typeof config.canStartNew === 'string' && config.canStartNew === '') {
        delete service.canStartNew;
      }

      return service;
    }),
  );

  constructor(private appService: AppService) {}
}
