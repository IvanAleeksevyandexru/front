/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
// eslint-disable-next-line
import { Subscription } from 'rxjs';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { INFO_SCREEN_COMPONENT } from '../../../../../constant/global';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
})
export class InfoScreenComponent implements OnDestroy {
  // <-- constant
  infoScreenComponent = INFO_SCREEN_COMPONENT;

  // <-- variable
  subscriptions: Array<Subscription> = [];

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(private navService: NavigationService) {
    this.subscriptions.push(this.navService.clickToBack$.subscribe(() => this.prevStep()));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  nextStep() {
    this.nextStepEvent.emit();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }
}
