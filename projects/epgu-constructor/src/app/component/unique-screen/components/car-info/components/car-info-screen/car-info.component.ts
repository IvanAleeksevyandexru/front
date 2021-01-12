import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  ActionType,
  ComponentActionDto,
  DisplayDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CarInfoValues } from '../../models/car-info.interface';

// TODO компонент на удаление (объединить с epgu-constructor-confirm-personal-user-data)
@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoComponent {
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  display$: Observable<DisplayDto> = this.screenService.display$;
  carInfo$: Observable<CarInfoValues> = this.display$.pipe(
    filter((display: DisplayDto) => !!display?.components[0].value),
    map((display: DisplayDto) => {
      const carInfo = display.components[0].value;
      this.currentAnswersService.state = carInfo;
      return JSON.parse(carInfo);
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
    private currentAnswersService: CurrentAnswersService,
  ) {}
}
