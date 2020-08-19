import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'app-invitation-screen',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  providers: [UnsubscribeService],
})
export class RootComponent implements OnInit {
  // <-- constant
  typeComponent = SCREEN_COMPONENT_NAME;

  @Input() data: EgpuResponseDisplayInterface;
  @Output() resolve: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
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

  sendEmail(email: string) {
    this.resolve.emit(email);
  }
}
