import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CycledFieldsService } from '../services/cycled-fields/cycled-fields.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { Screen } from '../screen.types';
import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';

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
  screenComponentName = ComponentScreenComponentTypes;
  isShowActionBtn = false;

  // <-- variables
  componentSetting: ComponentSetting = {
    displayContinueBtn: true,
    displayWarningAnswers: false,
  };
  componentData = null;

  constructor(
    private navigationService: NavigationService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private cycledFieldsService: CycledFieldsService,
  ) {}

  ngOnInit(): void {
    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.currentCycledFields$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((currentCycledFields) => {
        this.cycledFieldsService.initCycledFields(currentCycledFields);
      });

    this.screenService.componentType$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((type) => this.calcIsShowActionBtn(type as ComponentScreenComponentTypes));
  }

  /**
   * Возвращение на экран назад
   */
  prevStep(): void {
    this.navigationService.prevStep.next();
  }

  /**
   * Переход на следующую страницу и передача данных
   */
  nextStep(action: any): void {
    let value: string;
    if (typeof this.currentAnswersService.state === 'object') {
      value = JSON.stringify(this.currentAnswersService.state);
    } else {
      value = this.currentAnswersService.state;
    }

    if (action === 'skipStep') {
      this.navigationService.skipStep.next({
        payload: { ...this.cycledFieldsService.dataTransform(value) },
      });
    } else {
      this.navigationService.nextStep.next({
        payload: { ...this.cycledFieldsService.dataTransform(value) },
      });
    }
  }

  /**
   * Смена данных компонента
   * @param value - значение на установку
   */
  changedComponentData(value: any): void {
    this.componentData = value;
  }

  /**
   * Смена настроек компонента
   * @param settings - настройки компонента
   */
  changeComponentSettings(settings: ComponentSetting): void {
    this.componentSetting = { ...this.componentSetting, ...settings };
  }

  /**
   * Возвращение на главную
   */
  goToHomePage(): void {
    // TODO: navigate to Home Page
  }

  isUserData(): boolean | ComponentScreenComponentTypes {
    const type = this.screenService.componentType as ComponentScreenComponentTypes;
    const hasType = [
      ComponentScreenComponentTypes.divorceConsent,
      ComponentScreenComponentTypes.confirmPersonalUserData,
      ComponentScreenComponentTypes.confirmAnotherUserData,
      ComponentScreenComponentTypes.confirmChildData,
    ].includes(type);

    return hasType ? type : false;
  }

  isUserContactData(): boolean | ComponentScreenComponentTypes {
    const type = this.screenService.componentType as ComponentScreenComponentTypes;
    const hasType = [
      ComponentScreenComponentTypes.confirmPersonalUserPhone,
      ComponentScreenComponentTypes.confirmPersonalUserEmail,
    ].includes(type);

    return hasType ? type : false;
  }

  calcIsShowActionBtn(type: ComponentScreenComponentTypes) {
    this.isShowActionBtn = [
      ComponentScreenComponentTypes.registrationAddr,
      ComponentScreenComponentTypes.confirmPersonalUserRegAddr,
      ComponentScreenComponentTypes.divorceConsent,
    ].includes(type);
  }
}
