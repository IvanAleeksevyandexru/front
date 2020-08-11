/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { INFO_SCREEN_COMPONENT } from '../../../../../constant/global';

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
})
export class InfoScreenComponent {
  infoScreenComponent = INFO_SCREEN_COMPONENT;

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();

  nextStep() {
    this.nextStepEvent.next();
  }
}
