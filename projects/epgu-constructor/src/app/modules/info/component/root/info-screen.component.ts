/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { INFO_SCREEN_COMPONENT } from '../../../../../constant/global';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoScreenComponent {
  // <-- constant
  infoScreenComponent = INFO_SCREEN_COMPONENT;

  @Input() data: EgpuResponseDisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  nextStep() {
    this.nextStepEvent.emit();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }
}
