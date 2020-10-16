import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Screen } from '../screen.types';
import { NavigationPayload } from '../../form-player.types';
import { CycledFieldsService } from '../../services/cycled-fields/cycled-fields.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { InfoScreenComponentTypes } from './info-screen.types';
import {
  ActionType,
  ComponentDto,
  ComponentDtoAction,
} from '../../services/api/form-player-api/form-player-api.types';

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
  // <-- constant
  infoScreenComponent = InfoScreenComponentTypes;

  bodyActions: ComponentDtoAction[] = [];
  footerActions: ComponentDtoAction[] = [];

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

  /**
   * The method sets redirectToLk actions to footer and others to body of html
   * @param component
   */
  setActionButtons(component: ComponentDto) {
    component?.attrs?.actions?.forEach((action) => {
      if (action.type === ActionType.redirectToLK) {
        this.footerActions.push(action);
      } else {
        this.bodyActions.push(action);
      }
    });
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
