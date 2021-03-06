import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ActionType } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CarDetailInfoComponentAttrsDto, ServiceResult } from '../../models/car-info.interface';
import { CarDetailInfoService } from '../../service/car-detail-info.service';
import { ComponentBase } from '../../../../../../screen/screen.types';

@Component({
  selector: 'epgu-constructor-car-detail-info-container',
  templateUrl: './car-detail-info-container.component.html',
  styleUrls: ['./car-detail-info-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CarDetailInfoService],
})
export class CarDetailInfoContainerComponent {
  public data$: Observable<ComponentBase> = this.screenService.component$;
  public serviceResult = ServiceResult;
  public errors$ = this.screenService.component$.pipe(
    map((component) => component.attrs as CarDetailInfoComponentAttrsDto),
  );
  public buttons$ = combineLatest([
    this.screenService.buttons$,
    this.carInfoService.vehicleInfo$,
  ]).pipe(
    map(([buttons, vehicleInfo]) => {
      return buttons.filter((button) => {
        const isNextStep = button.type === ActionType.nextStep;

        return isNextStep ? vehicleInfo?.externalServiceCallResult === ServiceResult.SUCCESS : true;
      });
    }),
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
