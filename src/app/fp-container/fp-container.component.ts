import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import {
  ServiceEntity,
  ServiceInfo,
} from '../../../projects/epgu-constructor/src/app/form-player/form-player.types';
import { FormPlayerContext } from '../../../dist/epgu-constructor/app/form-player/form-player.types';

@Component({
  selector: 'fp-container',
  templateUrl: './fp-container.component.html',
  styleUrls: ['./fp-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class FpContainerComponent {
  service$: Observable<ServiceEntity> = this.appService.config$.pipe(
    map((config) => {
      const service: ServiceEntity = {
        serviceId: config.serviceId,
        targetId: config.targetId,
        serviceInfo: config.serviceInfo ? (JSON.parse(config.serviceInfo) as ServiceInfo) : null,
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

      if (typeof config.serviceInfo === 'string' && config.serviceInfo === '') {
        delete service.serviceInfo;
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
