import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import {
  ComponentActionDto,
  ScreenActionDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenBase } from '../screenBase';

export interface ComponentSetting {
  displayContinueBtn: boolean;
  displayWarningAnswers: boolean;
}

@Component({
  selector: 'epgu-constructor-component-screen',
  templateUrl: './component-screen.component.html',
  styleUrls: ['./component-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ComponentScreenComponent extends ScreenBase implements OnInit {
  // <-- constant
  screenComponentName = ComponentScreenComponentTypes;
  isShowActionBtn = false;
  actionButtons: ComponentActionDto[] = [];
  screenActionButtons: ScreenActionDto[] = [];

  // <-- variables
  componentSetting: ComponentSetting = {
    displayContinueBtn: true,
    displayWarningAnswers: false,
  };
  componentData = null;

  constructor(
    public currentAnswersService: CurrentAnswersService,
    public injector: Injector,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.screenService.componentType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((type) => {
      this.calcIsShowActionBtn(type as ComponentScreenComponentTypes);
      this.changeDetectionRef.markForCheck();
    });
    this.screenService.actions$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((actions: Array<ComponentActionDto>): void => {
        this.actionButtons = actions || [];
        this.changeDetectionRef.markForCheck();
      });
    this.screenService.buttons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((buttons: Array<ScreenActionDto>) => {
        this.screenActionButtons = buttons || [];
        this.changeDetectionRef.markForCheck();
      });
  }

  /**
   * Переход на следующую страницу и передача данных
   */
  nextStep(action?: string): void {
    let value: string;
    if (typeof this.currentAnswersService.state === 'object') {
      value = JSON.stringify(this.currentAnswersService.state);
    } else {
      value = this.currentAnswersService.state;
    }

    const payload = {};
    payload[this.screenService.component.id] = { visited: true, value };

    if (action === 'skipStep') {
      this.navigationService.skip({ payload });
    } else {
      this.navigationService.next({ payload });
    }
  }

  /**
   * Смена данных компонента
   * @param value - значение на установку
   */
  changedComponentData(value: string): void {
    this.componentData = value;
  }

  /**
   * Смена настроек компонента
   * @param settings - настройки компонента
   */
  changeComponentSettings(settings: Partial<ComponentSetting>): void {
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

  calcIsShowActionBtn(type: ComponentScreenComponentTypes): void {
    this.isShowActionBtn = [
      ComponentScreenComponentTypes.registrationAddr,
      ComponentScreenComponentTypes.confirmPersonalUserRegAddr,
      ComponentScreenComponentTypes.divorceConsent,
      ComponentScreenComponentTypes.fieldList,
    ].includes(type);
  }
}
