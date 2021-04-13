import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ComponentDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CarOwnerInfoComponentAttrsDto, OwnerCarInfo } from '../../models/car-info.interface';
import { ScreenService } from '../../../../../../screen/screen.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-car-owner-info-container',
  templateUrl: './car-owner-info-container.component.html',
  styleUrls: ['./car-owner-info-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarOwnerInfoContainerComponent {
  carOwnerInfo$: Observable<OwnerCarInfo> = this.screenService.component$.pipe(
    filter((component: ComponentDto) => !!component.value),
    map((component: ComponentDto) => {
      this.currentAnswersService.state = '';
      return JSON.parse(component.value);
    }),
  );

  pdfLink$ = this.screenService.component$.pipe(
    map(({ attrs }) => (attrs as CarOwnerInfoComponentAttrsDto).pdfLink),
  );

  constructor(
    public screenService: ScreenService,
    public currentAnswersService: CurrentAnswersService,
  ) {}
}
