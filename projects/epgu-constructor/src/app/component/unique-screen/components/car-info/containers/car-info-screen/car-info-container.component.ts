import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ActionType,
  ComponentActionDto,
  DisplayDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CarInfo, VehicleInfo } from '../../models/car-info.interface';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-car-info-container',
  templateUrl: './car-info-container.component.html',
  styleUrls: ['./car-info-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoContainerComponent implements OnInit {
  showNav$: Observable<boolean> = this.screenService.showNav$;
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  display$: Observable<DisplayDto> = this.screenService.display$;
  carInfo$: Observable<CarInfo> = this.display$.pipe(
    filter((display: DisplayDto) => !!display?.components[0].value),
    map((display: DisplayDto) => {
      const carInfo = display.components[0].value;
      this.currentAnswersService.state = carInfo;
      return this.mapCarInfo(JSON.parse(carInfo));
    }),
  );

  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };

  constructor(
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  ngOnInit(): void {}

  private mapCarInfo(carInfo: CarInfo): CarInfo {
    const mappedVehicleInfo = CarInfoContainerComponent.mapVehicleInfo(carInfo.vehicleInfo);

    return {
      ...carInfo,
      ...mappedVehicleInfo,
      notaryInfo: {
        ...carInfo.notaryInfo,
        pledging: carInfo.notaryInfo?.isPledged ? 'Да' : 'Нет',
      },
    };
  }

  private mapVehicleInfo(vehicleInfo: VehicleInfo): VehicleInfo {
    const {
      modelMarkName,
      modelName,
      markName,
      enginePowerHorse,
      enginePowerVt,
      ownerPeriods,
      searchingTransportFlag,
    } = vehicleInfo || {};

    return {
      ...vehicleInfo,
      ...{
        modelMarkName: modelMarkName || [markName, modelName].filter((value) => !!value).join(' '),
        enginePower: [enginePowerVt, enginePowerHorse].filter((value) => !!value).join('/'),
        searchingTransport: searchingTransportFlag ? 'Да' : 'Нет',
        ownerPeriods: (ownerPeriods || []).map((period) => {
          return {
            ...period,
            date:
              period.dateStart && period.dateEnd ? `${period.dateStart} - ${period.dateEnd}` : null,
          };
        }),
      },
    };
  }
}
