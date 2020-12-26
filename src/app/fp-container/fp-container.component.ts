import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { InitData } from '../../../projects/epgu-constructor/src/app/form-player/form-player.types';

@Component({
  selector: 'fp-container',
  templateUrl: './fp-container.component.html',
  styleUrls: ['./fp-container.component.scss'],
})
export class FpContainerComponent {
  service$: Observable<InitData> = this.appService.config$.pipe(
    map((config) => {
      const initData: InitData = {
        serviceId: config.serviceId,
        targetId: config.targetId,
        orderId: config.orderId,
        invited: config.invited,
        configId: config.configId,
        canStartNew: config.canStartNew,
        initState: config.initState,
        context: {
          queryParams: config.queryParams ? JSON.parse(config.queryParams) : [],
        },
      };

      if (typeof config.invited === 'string' && config.invited === '') {
        delete initData.invited;
      }

      if (!config.configId) {
        delete initData.configId;
      }

      if (typeof config.canStartNew === 'string' && config.canStartNew === '') {
        delete initData.canStartNew;
      }

      if (typeof config.queryParams === 'string' && config.queryParams === '') {
        delete initData.context.queryParams;
      }

      if (Object.entries(initData.context).length === 0) {
        delete initData.context;
      }

      return initData;
    }),
  );

  constructor(private appService: AppService) {}
}
