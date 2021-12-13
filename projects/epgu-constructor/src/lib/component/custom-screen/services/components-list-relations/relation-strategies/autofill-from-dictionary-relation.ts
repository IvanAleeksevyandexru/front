import { BaseRelation } from './base-relation';
import { KeyValueMap } from '@epgu/epgu-constructor-types';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
import { AbstractControl, FormArray } from '@angular/forms';
import { isEmpty } from 'lodash';
import DictionaryLikeModel from '../../../component-list-resolver/DictionaryLikeModel';

export class AutofillFromDictionaryRelation extends BaseRelation {
  public handleRelation(
    shownElements: CustomListStatusElements,
    dependentComponent: CustomComponent,
    reference: CustomComponentRef,
    componentVal: KeyValueMap,
    form: FormArray,
    components: CustomComponent[],
    initInitialValues: boolean,
  ): CustomListStatusElements {
    const dependentControl: AbstractControl = form.controls.find(
      (control: AbstractControl) => control.value.id === dependentComponent.id,
    );
    /* NOTICE: тут происходит некая магия, которая разруливает конфликтный кейс автофила данных
      при первичной загрузке формы и ранее закешированных в cachedAnswers данных, а также
      отрабатывается кейс различающий первичную загрузку данных и нового пользовательского выбора */
    /* TODO: подумать над реалзиацией сервиса, директивы или отдельного модуля,
      который бы отвечал за работу с предазгруженными данными, в том числе с механизмом рефов.
      А в идеале передать всю эту историю на бэк */
    if (initInitialValues) {
      const attributeName = reference.val as string;
      const componentId = reference.relatedRel;
      const dictionaryAttributeValue = this.getDictionaryAttributeValue(
        attributeName,
        componentId,
        components,
        componentVal,
      );

      if (dictionaryAttributeValue === undefined) {
        dependentControl.get('value').patchValue(null, { onlySelf: true, emitEvent: false });
      } else {
        dependentControl
          .get('value')
          .patchValue(
            !isEmpty(dependentControl.value.value)
              ? dependentControl.value.value
              : dictionaryAttributeValue,
            { onlySelf: true, emitEvent: false },
          );
      }

      dependentControl.markAsUntouched();
      dependentControl.updateValueAndValidity();
    }

    return this.afterHandleRelation(shownElements, dependentComponent, form);
  }

  /**
   * Возвращает значение атрибута attributeName из словаря компонента componentId.
   * Если атрибут не найден, то возвращается undefined.
   */
  private getDictionaryAttributeValue(
    dictionaryAttributeName: string,
    componentId: string,
    components: CustomComponent[],
    componentVal: KeyValueMap | '',
  ): unknown {
    const relatedComponent = components.find(
      (item) => item.id === componentId,
    ) as DictionaryLikeModel;
    if (relatedComponent) {
      return relatedComponent.getAttributeValue(componentVal, dictionaryAttributeName);
    }
    return undefined;
  }
}
