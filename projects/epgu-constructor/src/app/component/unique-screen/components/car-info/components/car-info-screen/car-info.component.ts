import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { EventBusService } from '../../../../../../form-player/services/event-bus/event-bus.service';
import { DisplayDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CarInfoValues } from '../../models/car-info.interface';

// TODO компонент на удаление (объединить с epgu-constructor-confirm-personal-user-data)
@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
})
export class CarInfoComponent {
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  display$: Observable<DisplayDto> = this.screenService.display$;
  carInfo$: Observable<CarInfoValues> = this.display$.pipe(
    filter((display: DisplayDto) => !!display?.components[0].value),
    map((display: DisplayDto) => JSON.parse(display.components[0].value)),
  );

  constructor(public screenService: ScreenService, private eventBusService: EventBusService) {}

  nextStep(carInfo: CarInfoValues): void {
    this.eventBusService.emit('nextStepEvent', JSON.stringify(carInfo));
  }
}
