import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// eslint-disable-next-line
import {Subscription} from 'rxjs';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
})
export class ScreenComponent implements OnInit, OnDestroy {
  // <-- constant
  screenComponentName = SCREEN_COMPONENT_NAME;

  // <-- variables
  componentData = null;
  subscriptions: Array<Subscription> = [];

  @Input() data: EgpuResponseDisplayInterface;
  @Input() isLoading: boolean;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    private screenComponentService: ScreenComponentService,
  ) {
    this.subscriptions.push(this.navService.clickToBack$.subscribe(() => this.prevStep()));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextStep() {
    this.nextStepEvent.emit(this.screenComponentService.dataToSend);
  }

  changedComponentData(value) {
    this.componentData = value;
  }
}
