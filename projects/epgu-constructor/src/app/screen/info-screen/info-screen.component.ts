import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NavigationPayload } from '../../form-player/form-player.types';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  ComponentDto,
  ComponentActionDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ScreenBase } from '../screenBase';

/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */
@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoScreenComponent extends ScreenBase implements OnInit {
  actionButtons: ComponentActionDto[] = [];

  constructor(public injector: Injector, private cycledFieldsService: CycledFieldsService) {
    super(injector);
  }

  ngOnInit(): void {
    this.screenService.currentCycledFields$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.cycledFieldsService.initCycledFields(this.screenService.currentCycledFields);
    });

    this.screenService.component$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((component) => this.setActionButtons(component));
  }

  setActionButtons(component: ComponentDto) {
    this.actionButtons = component?.attrs?.actions || [];
  }

  nextStep(): void {
    const navigation = { payload: this.getComponentState() };
    this.navigationService.nextStep.next(navigation);
  }

  getComponentState(): NavigationPayload {
    return this.cycledFieldsService.dataTransform();
  }
}
