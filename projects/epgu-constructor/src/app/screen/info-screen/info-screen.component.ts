import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
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

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.screenService.component$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((component) => this.setActionButtons(component));
  }

  setActionButtons(component: ComponentDto): void {
    this.actionButtons = component?.attrs?.actions || [];
  }

  nextStep(): void {
    this.navigationService.nextStep.next({});
  }
}
