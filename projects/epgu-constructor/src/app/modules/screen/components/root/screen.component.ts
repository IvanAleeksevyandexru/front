import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { mockOrderId } from '../payment/payment.constants';

interface ComponentSetting {
  displayContinueBtn: boolean;
  displayWarningAnswers: boolean;
}

@Component({
  selector: 'epgu-constructor-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss'],
  providers: [UnsubscribeService],
})
export class ScreenComponent implements OnInit {
  componentSetting: ComponentSetting = {
    displayContinueBtn: true,
    displayWarningAnswers: false,
  };
  // <-- constant
  screenComponentName = SCREEN_COMPONENT_NAME;

  // <-- variables
  componentData = null;
  form: FormGroup;
  isCycledFields: boolean;

  @Input() data: DisplayInterface;
  @Input() errors: object;
  @Output() nextStepEvent = new EventEmitter();
  @Output() prevStepEvent = new EventEmitter();

  constructor(
    public constructorService: ConstructorService,
    private navService: NavigationService,
    public componentStateService: ComponentStateService,
    private ngUnsubscribe$: UnsubscribeService,
    private fb: FormBuilder,
  ) {
    this.navService.clickToBack$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.prevStep());
  }

  ngOnInit(): void {
    this.form = this.fb.group({});
    this.isCycledFields = !!Object.keys(
      this.constructorService.response?.scenarioDto?.currentCycledFields,
    ).length;
  }

  /**
   * Возвращение на экран назад
   */
  prevStep(): void {
    this.prevStepEvent.emit();
  }

  /**
   * Переход на следующую страницу и передача данных
   * @param $event - событие следующего шага
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  nextStep($event) {
    let data: string | object;
    if (typeof this.componentStateService.state === 'object') {
      data = JSON.stringify(this.componentStateService.state);
    } else {
      data = this.componentStateService.state;
    }

    if (this.isCycledFields) {
      data = this.componentStateService.state;
    }

    this.nextStepEvent.emit(data);
  }

  /**
   * Возвращает идентификатор заявления
   */
  get getOrderId(): string {
    // TODO: Переделать на получение заявки из ранее данных ответов
    return mockOrderId;
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
