import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { CycledFieldsService } from '../../services/cycled-fields/cycled-fields.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { CurrentAnswersService } from '../current-answers.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { ComponentScreenComponentTypes } from './component-screen.types';
import { ConfirmUserDataState } from './types/confirm-user-data.types';

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

  // <-- variables
  componentSetting: ComponentSetting = {
    displayContinueBtn: true,
    displayWarningAnswers: false,
  };
  componentData = null;
  form: FormGroup;
  isCycledFields = false;

  constructor(
    private navigationService: NavigationService,
    public currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private fb: FormBuilder,
    private cycledFieldsService: CycledFieldsService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.currentCycledFields$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((currentCycledFields) => {
        this.cycledFieldsService.initCycledFields(currentCycledFields);
      });
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
  nextStep(): void {
    let value: string;
    if (typeof this.currentAnswersService.state === 'object') {
      value = JSON.stringify(this.currentAnswersService.state);
    } else if (this.isUserData()) {
      value = JSON.stringify(this.getUserDataForNavigate());
    } else {
      value = this.currentAnswersService.state;
    }

    this.navigationService.nextStep.next({
      payload: { ...this.cycledFieldsService.dataTransform(value) },
    });
  }

  /**
   * Подготовка данных к отправки для компонетов divorceConsent и confirmPersonalUserData
   */
  private getUserDataForNavigate(): { [key: string]: any } {
    const { states } = JSON.parse(this.currentAnswersService.state) as ConfirmUserDataState;

    return states.reduce((groupAcc, group) => {
      const fields = group.fields.reduce<{ [key: string]: any }>((fieldAcc, field) => {
        return field.isTransient
          ? fieldAcc
          : {
              ...fieldAcc,
              [field.name]: field.value,
            };
      }, {});

      return {
        ...groupAcc,
        ...fields,
      };
    }, {});
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
    ].includes(type);

    return hasType ? type : false;
  }
}
