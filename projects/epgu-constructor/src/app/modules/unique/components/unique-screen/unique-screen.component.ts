import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
// eslint-disable-next-line
import { Subscription } from 'rxjs';
import { UNIQUE_COMPONENT_NAME } from '../../../../../constant/global';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';

@Component({
  selector: 'app-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
})
export class UniqueScreenComponent implements OnDestroy {
  // <-- constant
  uniqueComponentName = UNIQUE_COMPONENT_NAME;

  // <-- variables
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

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextStep(data?) {
    this.nextStepEvent.emit(data);
  }
}
