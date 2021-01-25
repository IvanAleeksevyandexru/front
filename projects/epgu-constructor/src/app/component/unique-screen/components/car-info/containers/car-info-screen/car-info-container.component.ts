import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ActionType,
  ComponentActionDto,
  DisplayDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CarInfo, CarInfoErrors, CarInfoErrorsDto } from '../../models/car-info.interface';
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
  carInfo$: Observable<CarInfo> = this.display$.pipe(
    filter((display: DisplayDto) => !!display?.components[0].value),
    map((display: DisplayDto) => {
      const carInfo = JSON.parse(display.components[0].value);
      this.currentAnswersService.state = carInfo;

      this.carInfoErrors = this.mapCarInfoErrors(display.components[0]?.attrs?.errors, carInfo);

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

  private mapCarInfoErrors(errorsDto: CarInfoErrorsDto, carInfo: CarInfo): CarInfoErrors {
    return carInfo.errors && <CarInfoErrors>carInfo.errors.reduce((errors, error) => {
        const text = errorsDto && errorsDto[error.type];
        return { ...errors, [error.service]: { type: error.type, text } };
      }, {});
  }
}
