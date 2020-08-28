import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EMPTY_SCREEN_COMPONENT } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-empty',
  templateUrl: './empty.component.html',
  providers: [UnsubscribeService],
})
export class EmptyComponent {
  // <-- constant
  emptyComponentName = EMPTY_SCREEN_COMPONENT;

  @Input() data: DisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();
}
