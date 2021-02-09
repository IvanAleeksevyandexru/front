import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ActionType,
  ComponentActionDto,
  ComponentDto,
  DisplayDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import {
  CarInfo,
  CarInfoComponentAttrsDto,
  CarInfoDisplayedError,
  CarInfoErrors,
  CarInfoErrorsDto,
  ServiceResult,
} from '../../models/car-info.interface';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-car-info-container',
  templateUrl: './car-info-container.component.html',
  styleUrls: ['./car-info-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoContainerComponent implements OnInit {
  carInfoErrors: CarInfoErrors;
  showNav$: Observable<boolean> = this.screenService.showNav$;
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  display$: Observable<DisplayDto> = this.screenService.display$;
  carInfo$: Observable<CarInfo> = this.screenService.component$.pipe(
    filter((component: ComponentDto) => !!component.value),
    map((component: ComponentDto) => {
      const carInfo = JSON.parse(component.value);
      this.currentAnswersService.state = carInfo;

      const attrs = <CarInfoComponentAttrsDto>component?.attrs;
      this.carInfoErrors = this.mapCarInfoErrors(attrs?.errors, carInfo);

      return carInfo;
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

  mapCarInfoErrors(errorsDto: CarInfoErrorsDto, carInfo: CarInfo): CarInfoErrors {
    const {
      notaryServiceCallResult: notaryResult,
      vehicleServiceCallResult: vehicleResult,
    } = carInfo;

    if (this.isExternalCommonError(notaryResult, vehicleResult)) {
      return {
        externalCommon: this.buildError(ServiceResult.EXTERNAL_SERVER_ERROR, errorsDto),
      };
    }

    return {
      notary: this.isError(notaryResult) ? this.buildError(notaryResult, errorsDto) : null,
      vehicle: this.isError(vehicleResult) ? this.buildError(vehicleResult, errorsDto) : null,
    };
  }

  private isExternalCommonError(
    notaryResult: ServiceResult,
    vehicleResult: ServiceResult,
  ): boolean {
    return [notaryResult, vehicleResult].every(
      (status) => status === ServiceResult.EXTERNAL_SERVER_ERROR,
    );
  }

  private buildError(type: ServiceResult, errorsDto: CarInfoErrorsDto): CarInfoDisplayedError {
    return { type, text: errorsDto && errorsDto[type] };
  }

  private isError(result: ServiceResult): boolean {
    return result && result !== ServiceResult.SUCCESS;
  }
}
