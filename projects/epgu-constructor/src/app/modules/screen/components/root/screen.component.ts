import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';

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
  ngUnsubscribe$ = new Subject();

  @Input() data: EgpuResponseDisplayInterface;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    public constructorService: ConstructorService,
    private navService: NavigationService,
    private screenComponentService: ScreenComponentService,
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

  nextStep() {
    this.nextStepEvent.emit(this.screenComponentService.dataToSend);
  }

  changedComponentData(value) {
    this.componentData = value;
  }
}
