import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UNIQUE_COMPONENT_NAME } from '../../../constant/global';
import { Screen, ScreenData } from '../screen.types';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'epgu-constructor-unique-screen',
  templateUrl: './unique-screen.component.html',
  styleUrls: ['./unique-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class UniqueScreenComponent implements OnInit, Screen {
  // <-- constant
  uniqueComponentName = UNIQUE_COMPONENT_NAME;
  screenData: ScreenData;

  constructor(
    private navigationService: NavigationService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
      });
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  // TODO: add NextStepData typing support
  nextStep(data?): void {
    this.navigationService.nextStep.next({ data });
  }
}
