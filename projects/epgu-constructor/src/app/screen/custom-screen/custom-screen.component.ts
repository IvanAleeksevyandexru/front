import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  CustomComponentOutputData,
  CustomComponentValidationConditions,
} from '../../shared/components/components-list/components-list.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { NavigationPayload } from '../../form-player/form-player.types';
import {
  ComponentActionDto,
  ScreenActionDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ScreenBase } from '../screen-base';
import { CustomScreenService } from './custom-screen.service';
import { NEXT_STEP_ACTION } from '../../shared/constants/actions';

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class CustomScreenComponent extends ScreenBase implements OnInit {
  screenActionButtons: ScreenActionDto[] = [];
  dataToSend: NavigationPayload;
  isValid: boolean;
  nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public injector: Injector,
    private customScreenService: CustomScreenService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.screenService.buttons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((buttons: Array<ScreenActionDto>) => {
        this.screenActionButtons = buttons || [];
        this.changeDetectionRef.markForCheck();
      });
  }

  nextStep(): void {
    // TODO: заглушка для абстрактного метода ScreenBase
  }

  /**
   * Форматируем данные перед отправкой
   * @param changes - данные на отправку
   */
  changeComponentsList(changes: CustomComponentOutputData): void {
    const notAtLeastOne = Object.values(changes).filter(
      (item) => item.condition !== CustomComponentValidationConditions.atLeastOne,
    );
    const atLeastOne = Object.values(changes).filter(
      (item) => item.condition === CustomComponentValidationConditions.atLeastOne,
    );

    const notAtLeastOneExpression: boolean = notAtLeastOne.length
      ? notAtLeastOne.every((item) => item.isValid)
      : true;

    const atLeastOneExpression: boolean = atLeastOne.length
      ? atLeastOne.some((item) => item.value) && atLeastOne.every((item) => item.isValid)
      : true;

    console.log('changeComponentsList');

    this.isValid = notAtLeastOneExpression && atLeastOneExpression;
    this.dataToSend = this.customScreenService.getFormattedData(changes);
    this.currentAnswersService.isValid = this.isValid;
    this.currentAnswersService.state = this.dataToSend;
  }
}
