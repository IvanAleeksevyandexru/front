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
  ActionType,
  ComponentActionDto,
  DTOActionAction,
  ScreenActionDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenBase } from '../screenBase';

@Component({
  selector: 'epgu-constructor-component-screen',
  templateUrl: './component-screen.component.html',
  styleUrls: ['./component-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ComponentScreenComponent extends ScreenBase implements OnInit {
  screenComponentName = ComponentScreenComponentTypes;
  isShowActionBtn = false;
  actionButtons: ComponentActionDto[] = [];
  screenActionButtons: ScreenActionDto[] = [];
  nextStepAction: ComponentActionDto = {
    label: 'Продолжить',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };
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

  nextStep(): void {
    // TODO: заглушка абстрактного метода ScreenBase
  }
}
