import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { CurrentAnswersService } from '../current-answers.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { ComponentScreenComponentTypes } from './component-screen.types';
import { CycledFieldsService } from '../../services/cycled-fields/cycled-fields.service';

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
    public componentStateService: CurrentAnswersService,
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
  nextStep() {
    let value: string;
    if (typeof this.componentStateService.state === 'object') {
      value = JSON.stringify(this.componentStateService.state);
    } else {
      value = this.componentStateService.state;
    }

    this.navigationService.nextStep.next({
      payload: { ...this.cycledFieldsService.dataTransform(this.screenService.component, value) },
    });
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
}
