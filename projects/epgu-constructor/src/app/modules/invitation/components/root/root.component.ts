import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  ngUnsubscribe$ = new Subject();

  @Input() data: EgpuResponseDisplayInterface;
  @Output() resolve: EventEmitter<string> = new EventEmitter<string>();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  sendEmail(email: string) {
    this.resolve.emit(email);
  }
}
