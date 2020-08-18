import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
  ngUnsubscribe$ = new Subject();

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(private navService: NavigationService) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  prevStep() {
    this.prevStepEvent.emit();
  }

  nextStep(data?) {
    this.nextStepEvent.emit(data);
  }
}
