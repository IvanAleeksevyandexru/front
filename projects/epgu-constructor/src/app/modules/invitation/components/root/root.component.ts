import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// eslint-disable-next-line
import { Subscription } from 'rxjs';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, OnDestroy {
  // <-- constant
  typeComponent = SCREEN_COMPONENT_NAME;

  // <-- variables
  subscriptions: Array<Subscription> = [];

  @Input() data: EgpuResponseDisplayInterface;
  @Output() resolve: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
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

  sendEmail(email: string) {
    this.resolve.emit(email);
  }
}
