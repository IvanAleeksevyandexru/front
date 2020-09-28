import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ComponentStateService } from '../component-state.service';
import { Screen } from '../screen.types';
import { ScreenService } from '../screen.service';
import { ComponentScreenComponentTypes } from './component-screen.types';
import { NavigationPayload } from '../../form-player.types';
import { CurrentCycledFieldsDto } from '../../services/api/form-player-api/form-player-api.types';

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
    public componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.navigationService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());

    this.screenService.currentCycledFields$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((currentCycledFields) => {
        this.initCycledFields(currentCycledFields);
      });
  }

  initCycledFields(currentCycledFields: CurrentCycledFieldsDto): void {
    this.isCycledFields = !!Object.keys(currentCycledFields).length;
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
    const componentId = this.screenService.component.id;
    let payload: NavigationPayload = {};
    let value: string;
    if (typeof this.componentStateService.state === 'object') {
      value = JSON.stringify(this.componentStateService.state);
    } else {
      value = this.componentStateService.state;
    }

    payload[componentId] = {
      visited: true,
      value: value || '',
    };

    if (this.isCycledFields) {
      payload = this.componentStateService.state as NavigationPayload; // TODO: need clarify case
    }

    this.navigationService.nextStep.next({ payload });
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
