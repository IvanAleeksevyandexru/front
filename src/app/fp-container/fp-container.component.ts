import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { ServiceEntity } from '../../../projects/epgu-constructor/src/app/form-player/form-player.types';
import { FormPlayerContext } from '../../../dist/epgu-constructor/app/form-player/form-player.types';

@Component({
  selector: 'fp-container',
  templateUrl: './fp-container.component.html',
  styleUrls: ['./fp-container.component.scss'],
})
export class FpContainerComponent {
  service$: Observable<ServiceEntity> = this.appService.config$.pipe(
    map((config) => {
      const service: ServiceEntity = {
        serviceId: config.serviceId,
        targetId: config.targetId,
        orderId: config.orderId,
        invited: config.invited,
        canStartNew: config.canStartNew,
      };

      if (typeof config.invited === 'string' && config.invited === '') {
        delete service.invited;
      }

      if (typeof config.canStartNew === 'string' && config.canStartNew === '') {
        delete service.canStartNew;
      }

      return service;
    }),
  );

  context$: Observable<FormPlayerContext> = this.appService.config$.pipe(
    map((config) => {
      const context: FormPlayerContext = {
        configId: config.configId,
        initState: config.initState,
        queryParams: config.queryParams ? JSON.parse(config.queryParams) : [],
      };

      if (!config.configId) {
        delete context.configId;
      }

      if (typeof config.queryParams === 'string' && config.queryParams === '') {
        delete context.queryParams;
      }

      return context;
    }),
  );

  constructor(private appService: AppService) {}
}
