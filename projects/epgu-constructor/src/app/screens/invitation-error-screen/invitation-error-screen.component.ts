import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../constant/global';
import { DisplayInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { Screen } from '../../../interfaces/screen.interface';
import {
  NextStepEventData,
  PrevStepEventData,
} from '../../../interfaces/step-event-data.interface';

@Component({
  selector: 'epgu-constructor-invitation-screen',
  templateUrl: './invitation-error-screen.component.html',
  styleUrls: ['./invitation-error-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class InvitationErrorScreenComponent implements OnInit, Screen {
  @Input() data: DisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter<NextStepEventData>();
  @Output() prevStepEvent = new EventEmitter<PrevStepEventData>();
  typeComponent = SCREEN_COMPONENT_NAME;

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  sendEmail(email: string) {
    const nextStepData = { data: email, options: { componentId: 'errorScr' } };
    this.nextStepEvent.emit(nextStepData);
  }
}
