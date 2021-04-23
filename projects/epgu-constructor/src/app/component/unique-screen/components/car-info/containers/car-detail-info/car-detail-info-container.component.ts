import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { map } from 'rxjs/operators';

import { ScreenService } from '../../../../../../screen/screen.service';
import { CarInfoComponentAttrsDto, ServiceResult } from '../../models/car-info.interface';
import { CarDetailInfoService } from '../../service/car-detail-info.service';

@Component({
  selector: 'epgu-constructor-car-detail-info-container',
  templateUrl: './car-detail-info-container.component.html',
  styleUrls: ['./car-detail-info-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CarDetailInfoService],
})
export class CarDetailInfoContainerComponent {
  public serviceResult = ServiceResult;
  public errors$ = this.screenService.component$.pipe(
    map((component) => component.attrs as CarInfoComponentAttrsDto),
  );

  constructor(public carInfoService: CarDetailInfoService, public screenService: ScreenService) {
    this.carInfoService.fetchData();
  }

  @HostListener('click', ['$event.target']) onClick(event$: HTMLElement): void {
    const hasRetry = event$.dataset.retry;
    if (hasRetry) {
      const vehicleInfoError =
        this.carInfoService.vehicleInfo$.getValue().externalServiceCallResult ===
        this.serviceResult.EXTERNAL_SERVER_ERROR;
      const notaryInfoError =
        this.carInfoService.notaryInfo$.getValue().externalServiceCallResult ===
        this.serviceResult.EXTERNAL_SERVER_ERROR;
      const isCommonError = vehicleInfoError && notaryInfoError;

      if (isCommonError || (notaryInfoError && !this.carInfoService.hasVin)) {
        this.carInfoService.fetchData();
        return;
      }

      if (vehicleInfoError) {
        this.carInfoService.fetchVehicleInfo().subscribe();
      }

      if (notaryInfoError) {
        this.carInfoService.fetchNotaryInfo().subscribe();
      }
    }
  }
}
