import { Component, EventEmitter, Input, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UNIQUE_COMPONENT_NAME } from '../../../../../constant/global';
// eslint-disable-next-line import/named
import { DisplayInterface, Gender } from '../../../../../interfaces/epgu.service.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class UniqueScreenComponent {
  // <-- constant
  uniqueComponentName = UNIQUE_COMPONENT_NAME;

  @Input() data: DisplayInterface;
  @Input() errors: object;
  @Input() gender: Gender;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(private navService: NavigationService, private ngUnsubscribe$: UnsubscribeService) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextStep(data?) {
    this.nextStepEvent.emit(data);
  }
}
