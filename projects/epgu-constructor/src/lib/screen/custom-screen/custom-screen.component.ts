import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DisplayDto, NavigationPayload } from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomComponentValidationConditions,
  CustomScreenComponentTypes,
} from '../../component/custom-screen/components-list.types';
import { ScreenBase } from '../screen-base';
import { CustomScreenService } from './custom-screen.service';

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomScreenComponent extends ScreenBase implements OnInit {
  data$: Observable<DisplayDto> = this.screenService.display$.pipe(
    tap(() => this.cdr.markForCheck()),
  );
  dataToSend: NavigationPayload;
  isValid: boolean;
  helperText: CustomComponent;

  constructor(
    public injector: Injector,
    private customScreenService: CustomScreenService,
    private cdr: ChangeDetectorRef,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.setHelperText();
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

    this.isValid = notAtLeastOneExpression && atLeastOneExpression;
    this.dataToSend = this.customScreenService.getFormattedData(changes);
    this.currentAnswersService.isValid = this.isValid;
    this.currentAnswersService.state = this.dataToSend;
    this.cdr.markForCheck();
  }

  private setHelperText(): void {
    const components = this.screenService.display?.components;
    let helperTextIndex = -1;

    this.helperText = components?.find((component: CustomComponent, index: number) => {
      if (
        component.attrs.isTextHelper &&
        component.attrs.isBottomSlot &&
        component.type === CustomScreenComponentTypes.LabelSection
      ) {
        helperTextIndex = index;
        return true;
      }
      return false;
    }) as CustomComponent;

    if (helperTextIndex > -1) {
      components?.splice(helperTextIndex, 1);
    }
  }
}
