import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { CarInfoValues } from '../../models/car-info.interface';
import { DisplayDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../../screen/screen.service';

// TODO компонент на удаление (объединить с epgu-constructor-confirm-personal-user-data)
@Component({
  selector: 'epgu-constructor-car-info',
  templateUrl: './car-info.component.html',
  styleUrls: ['./car-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarInfoComponent {
  @Output() nextStepEvent = new EventEmitter<string>();

  isLoading$: Observable<boolean> = this.screenService.isLoading$;

  display$: Observable<DisplayDto> = this.screenService.display$;

  carInfo$: Observable<CarInfoValues> = this.display$.pipe(
    filter((display: DisplayDto) => !!display?.components[0].value),
    map((display: DisplayDto) => JSON.parse(display.components[0].value)),
  );

  constructor(public screenService: ScreenService) {}

  nextStep(carInfo: CarInfoValues): void {
    this.nextStepEvent.emit(JSON.stringify(carInfo));
  }
}
