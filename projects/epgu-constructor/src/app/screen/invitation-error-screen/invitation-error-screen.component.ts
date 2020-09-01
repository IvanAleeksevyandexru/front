import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../constant/global';
import { FormPlayerService } from '../../services/form-player/form-player.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { ScreenOutputs, ScreenData } from '../../../interfaces/screen.interface';
import {
  NextStepEventData,
  PrevStepEventData,
} from '../../../interfaces/step-event-data.interface';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InvitationErrorScreenComponent implements OnInit, ScreenOutputs {
  typeComponent = SCREEN_COMPONENT_NAME;
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

  prevStep() {
    this.prevStepEvent.emit();
  }

  sendEmail(email: string) {
    const nextStepData = { data: email, options: { componentId: 'errorScr' } };
    this.nextStepEvent.emit(nextStepData);
  }
}
