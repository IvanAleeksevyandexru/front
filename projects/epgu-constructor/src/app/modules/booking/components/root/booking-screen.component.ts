import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';

@Component({
  selector: 'app-booking-screen',
  templateUrl: './booking-screen.component.html',
  styleUrls: ['./booking-screen.component.scss'],
})
export class BookingScreenComponent implements OnDestroy {
  // <-- variable
  ngUnsubscribe$ = new Subject();

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    private navService: NavigationService,
    public constructorService: ConstructorService,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  nextStep() {
    this.nextStepEvent.emit();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }
}
