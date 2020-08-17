/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */

import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { INFO_SCREEN_COMPONENT } from '../../../../../constant/global';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';

@Component({
  selector: 'app-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
})
export class InfoScreenComponent implements OnDestroy {
  // <-- constant
  infoScreenComponent = INFO_SCREEN_COMPONENT;

  // <-- variable
  ngUnsubscribe$ = new Subject();

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  nextStep() {
    this.nextStepEvent.emit();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }
}
