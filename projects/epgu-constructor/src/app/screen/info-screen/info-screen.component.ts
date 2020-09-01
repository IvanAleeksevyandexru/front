/**
 * Особенность этого типа компонента в том что заголовок и submit кнопка находится внутри белой плашки.
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { INFO_SCREEN_COMPONENT } from '../../../constant/global';
import { ScreenOutputs, ScreenData } from '../../../interfaces/screen.interface';
import { FormPlayerService } from '../../services/form-player/form-player.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import {
  NextStepEventData,
  PrevStepEventData,
} from '../../../interfaces/step-event-data.interface';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'epgu-constructor-info-screen',
  templateUrl: './info-screen.component.html',
  styleUrls: ['./info-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoScreenComponent implements ScreenOutputs, OnInit {
  // <-- constant
  infoScreenComponent = INFO_SCREEN_COMPONENT;
  screenData: ScreenData;

  @Output() nextStepEvent = new EventEmitter<NextStepEventData>();
  @Output() prevStepEvent = new EventEmitter<PrevStepEventData>();

  constructor(
    private navService: NavigationService,
    public constructorService: FormPlayerService,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
      });
  }

  nextStep() {
    this.nextStepEvent.emit();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }
}
