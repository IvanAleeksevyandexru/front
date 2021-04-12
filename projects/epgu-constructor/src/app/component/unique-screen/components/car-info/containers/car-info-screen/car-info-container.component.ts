import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ActionType,
  ComponentActionDto,
  ComponentDto,
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
export class CarInfoContainerComponent {
  carInfoErrors: CarInfoErrors;
  carInfo$: Observable<CarInfo> = this.screenService.component$.pipe(
    filter((component: ComponentDto) => !!component.value),
    map((component: ComponentDto) => {
      const carInfo = JSON.parse(component.value);
      this.currentAnswersService.state = carInfo;
      this.currentAnswersService.isValid = true;

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
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
  ) {}

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
