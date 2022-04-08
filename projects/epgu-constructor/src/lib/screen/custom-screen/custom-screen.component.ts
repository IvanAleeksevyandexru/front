import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormArray } from '@angular/forms';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DisplayDto, NavigationPayload } from '@epgu/epgu-constructor-types';

import {
  CustomComponent,
  CustomComponentOutputData,
  CustomComponentValidationConditions,
  CustomListStatusElements,
  CustomScreenComponentTypes,
} from '../../component/custom-screen/components-list.types';
import { ScreenBase } from '../screen-base';
import { CustomScreenService } from './custom-screen.service';
import { NO_WHITE_BACKGROUND_COMPONENTS } from '../../shared/constants/no-white-background-components';
import { RefRelationService } from '../../shared/services/ref-relation/ref-relation.service';
import { EMPTY_VALUE } from '../../shared/services/ref-relation/ref-relation.contant';

@Component({
  selector: 'epgu-constructor-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomScreenComponent extends ScreenBase implements OnInit {
  data$: Observable<DisplayDto> = this.screenService.display$.pipe(
    //TODO: нужно создать механизм для активации белой подложки по данным из json
    tap(({ components }) => {
      if (components.some((component) => NO_WHITE_BACKGROUND_COMPONENTS.includes(component.type))) {
        this.disableWhiteBackground = true;
      }
      this.cdr.markForCheck();
    }),
  );
  dataToSend: NavigationPayload;
  isValid: boolean;
  helperText: CustomComponent;
  disableWhiteBackground: boolean;
  customScreenForm: FormArray;
  customListStatusElements: CustomListStatusElements;

  constructor(
    public injector: Injector,
    private customScreenService: CustomScreenService,
    private cdr: ChangeDetectorRef,
    private refRelationService: RefRelationService,
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
      ? atLeastOne.some(
          (item) => !this.refRelationService.isValueEquals(EMPTY_VALUE, item.value),
        ) && atLeastOne.every((item) => item.isValid)
      : true;

    this.isValid = notAtLeastOneExpression && atLeastOneExpression;
    this.dataToSend = this.customScreenService.getFormattedData(changes);
    this.currentAnswersService.isValid = this.isValid;
    this.currentAnswersService.state = this.dataToSend;
    this.cdr.markForCheck();
  }

  setCustomScreenForm(form: FormArray): void {
    this.customScreenForm = form;
  }

  setCustomListStatusElements(elements: CustomListStatusElements): void {
    this.customListStatusElements = elements;
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
