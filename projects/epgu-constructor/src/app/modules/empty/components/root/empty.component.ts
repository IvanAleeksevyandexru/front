import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { ScreenComponentService } from '../../../screen/service/screen-component/screen-component.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';

@Component({
  selector: 'epgu-constructor-empty',
  templateUrl: './empty.component.html',
  providers: [UnsubscribeService],
})
export class EmptyComponent implements OnInit {
  // <-- constant
  screenComponentName = SCREEN_COMPONENT_NAME;

  // <-- variables
  componentData = null;

  @Input() data: DisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    public constructorService: ConstructorService,
    private navService: NavigationService,
    public screenComponentService: ScreenComponentService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnInit(): void {}

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextStep() {
    if (typeof this.screenComponentService.dataToSend === 'object') {
      this.nextStepEvent.emit(JSON.stringify(this.screenComponentService.dataToSend));
    } else {
      this.nextStepEvent.emit(this.screenComponentService.dataToSend);
    }
  }

  changedComponentData(value) {
    this.componentData = value;
  }
}
