import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../constant/global';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';
import { Screen, ScreenData } from '../../../interfaces/screen.interface';
import { ScreenService } from '../screen.service';

interface ComponentSetting {
  displayContinueBtn: boolean;
  displayWarningAnswers: boolean;
}

@Component({
  selector: 'epgu-constructor-component-screen',
  templateUrl: './component-screen.component.html',
  styleUrls: ['./component-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class ComponentScreenComponent implements OnInit, Screen {
  // <-- constant
  screenComponentName = SCREEN_COMPONENT_NAME;

  // <-- variables
  componentSetting: ComponentSetting = {
    displayContinueBtn: true,
    displayWarningAnswers: false,
  };
  componentData = null;
  form: FormGroup;
  isCycledFields = false;
  screenData: ScreenData;

  constructor(
    private navigationService: NavigationService,
    public componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
    private screenService: ScreenService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.screenData$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((screenData: ScreenData) => {
        this.screenData = screenData;
        this.initCycledFields();
      });
  }

  initCycledFields() {
    this.isCycledFields = !!Object.keys(this.screenData?.currentCycledFields).length;
  }

  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  nextStep() {
    let data: string | object;
    if (typeof this.componentStateService.state === 'object') {
      data = JSON.stringify(this.componentStateService.state);
    } else {
      data = this.componentStateService.state;
    }

    if (this.isCycledFields) {
      data = this.componentStateService.state;
    }

    this.navigationService.nextStep.next({ data });
  }

  changedComponentData(value: any): void {
    this.componentData = value;
  }

  changeComponentSettings(settings: ComponentSetting): void {
    this.componentSetting = { ...this.componentSetting, ...settings };
  }

  goToHomePage(): void {
    // TODO: navigate to Home Page
  }
}
