import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Screen } from '../screen.types';
import { NavigationPayload } from '../../form-player.types';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { UnsubscribeService } from '../../shared/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import {
  ComponentDto,
  ComponentDtoAction,
} from '../../services/form-player-api/form-player-api.types';

/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */
@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoScreenComponent implements Screen, OnInit {
  actionButtons: ComponentDtoAction[] = [];

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private cycledFieldsService: CycledFieldsService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

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

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep(): void {
    const navigation = { payload: this.getComponentState() };
    this.navigationService.nextStep.next(navigation);
  }

  getComponentState(): NavigationPayload {
    return this.cycledFieldsService.dataTransform();
  }
}
