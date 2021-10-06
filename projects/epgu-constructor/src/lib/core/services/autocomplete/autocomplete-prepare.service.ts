import { Injectable } from '@angular/core';
import { Answer, ComponentDto } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { UploadedFile } from '../terra-byte-api/terra-byte-api.types';
import { isChildrenListType } from './autocomplete.const';
import { get as _get, cloneDeep as _cloneDeep } from 'lodash';
import {
  ISuggestionApi,
  ISuggestionApiValueField,
  ISuggestionItem,
  ISuggestionItemList,
} from './autocomplete.inteface';
import {
  CustomComponentAttr,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DATE_STRING_DOT_FORMAT } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../json-helper/json-helper.service';

@Injectable()
export class AutocompletePrepareService {
  constructor(
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private datesToolsService: DatesToolsService,
    private jsonHelperService: JsonHelperService,
  ) {}

  public getFormattedList(
    repeatableComponents: ComponentDto[][],
    componentsSuggestionsSet: Set<[string, string]>,
    fields: ISuggestionApiValueField[],
    id: number,
    componentMnemonic: string,
  ): ISuggestionItemList {
    const hints: { value: string; mnemonic: string }[] = this.getFormattedHints(
      repeatableComponents,
      componentsSuggestionsSet,
      fields,
      componentMnemonic,
    );
    const field = fields.find(
      (field: ISuggestionApiValueField) => field.mnemonic === componentMnemonic,
    );
    if (field) {
      let { value, mnemonic } = field;
      let originalItem = value;
      value = this.prepareValue(repeatableComponents, componentsSuggestionsSet, value, mnemonic);
      return {
        value,
        mnemonic,
        originalItem,
        id,
        hints,
      };
    } else {
      return null;
    }
  }

  public getParsedSuggestionsUploadedFiles(
    componentList: ISuggestionItemList[] = [],
  ): UploadedFile[] {
    return componentList.reduce((result, item) => {
      const parsedValue = item?.originalItem && JSON.parse(item.originalItem);
      const componentValues = [
        ...parsedValue?.uploads.reduce((acc, upload) => {
          acc.push(...upload.value);
          return acc;
        }, []),
      ];
      return [...result, ...componentValues];
    }, []);
  }

  public formatAndPassDataToSuggestions(
    repeatableComponents: ComponentDto[][],
    componentsSuggestionsSet: Set<[string, string]>,
    suggestions: ISuggestionApi[],
  ): void {
    let result: { [key: string]: ISuggestionItem } = {};

    suggestions.forEach((suggestion) => {
      const { values } = suggestion;
      const componentsEntries = Array.from(componentsSuggestionsSet) || [];
      values.forEach((value) => {
        const { fields, id } = value;
        componentsEntries.forEach(([componentMnemonic, componentId]: [string, string]) => {
          const componentList: ISuggestionItemList = this.getFormattedList(
            repeatableComponents,
            componentsSuggestionsSet,
            fields,
            id,
            componentMnemonic,
          );
          if (componentList) {
            if (result[componentId]) {
              result[componentId].list.push(componentList);
            } else {
              result[componentId] = {
                mnemonic: componentMnemonic,
                list: [componentList],
              };
            }
          }
        });
      });
    });

    this.screenService.suggestions = result;
  }

  public findAndUpdateComponentWithValue(
    repeatableComponents: ComponentDto[][],
    componentsSuggestionsSet: Set<[string, string]>,
    parentComponent: ComponentDto,
    mnemonic: string,
    value: string,
    id?: number,
    componentsGroupIndex?: number,
  ): void {
    const component = this.findComponent(
      repeatableComponents,
      componentsSuggestionsSet,
      mnemonic,
      componentsGroupIndex,
    );
    const componentValue = this.findComponentValue(
      component,
      id,
      value,
      mnemonic,
      componentsSuggestionsSet,
    );

    this.setComponentValue(component, componentValue);

    if (isChildrenListType(parentComponent)) {
      const cachedAnswer: Answer = this.prepareCachedAnswers(
        parentComponent,
        component,
        componentsGroupIndex,
        componentValue,
      );
      this.screenService.cachedAnswers[parentComponent.id] = cachedAnswer;
      this.screenService.setCompValueToCachedAnswer(parentComponent.id, cachedAnswer?.value);
    }
  }

  /**
   * Записывает данные из currentAnswersService в screenService. Это делается для того, чтобы
   * введенные пользователем данные не потерялись после вызова screenService.updateScreenContent()
   */
  public setValuesToCachedAnswersOrCompValue(
    repeatableComponents,
    parentComponentId?: string,
  ): void {
    if (repeatableComponents.length) {
      let currentAnswerParsedValue;
      if (this.jsonHelperService.hasJsonStructure(this.currentAnswersService.state as string)) {
        currentAnswerParsedValue = JSON.parse(this.currentAnswersService.state as string);
      } else {
        currentAnswerParsedValue = this.currentAnswersService.state;
      }

      // оставляем первый элемент, чтобы правильно обрабатывалось удаление пользователем repeatable fields
      repeatableComponents.splice(1);

      currentAnswerParsedValue.forEach((currentAnswerItem: unknown, index: number) => {
        if (!repeatableComponents[index]) {
          const repeatableComponentsItemClone = _cloneDeep(repeatableComponents[0]);
          repeatableComponents.push(repeatableComponentsItemClone);
        }

        for (const repeatableComponentItem of repeatableComponents[index]) {
          repeatableComponentItem.value = currentAnswerItem[repeatableComponentItem.id];
        }

        this.screenService.setCompValueToCachedAnswer(
          parentComponentId,
          JSON.stringify(currentAnswerParsedValue),
        );
      });
    } else {
      for (const component of this.screenService.display.components) {
        component.value = this.currentAnswersService.state[component.id]?.value || '';
      }
    }
  }

  private getFormattedHints(
    repeatableComponents: ComponentDto[][],
    componentsSuggestionsSet: Set<[string, string]>,
    fields: ISuggestionApiValueField[],
    componentMnemonic: string,
  ): { value: string; mnemonic: string }[] {
    const isIncludedInComponentsSuggestionsMap = (mnemonic: string): boolean => {
      return Array.from(componentsSuggestionsSet).some(([suggestId]) => suggestId === mnemonic);
    };
    const orderByFieldsMnemonics = Array.from(componentsSuggestionsSet).map(
      ([suggestionId]) => suggestionId,
    );

    return fields
      .reduce((acc: { value: string; mnemonic: string }[], field) => {
        let { value, mnemonic } = field;
        if (
          mnemonic !== componentMnemonic &&
          typeof value !== 'boolean' &&
          isIncludedInComponentsSuggestionsMap(mnemonic)
        ) {
          value = this.prepareValue(
            repeatableComponents,
            componentsSuggestionsSet,
            value,
            mnemonic,
          );
          acc.push({
            value,
            mnemonic,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => {
        return (
          orderByFieldsMnemonics.indexOf(a.mnemonic) - orderByFieldsMnemonics.indexOf(b.mnemonic)
        );
      });
  }

  private prepareValue(
    repeatableComponents: ComponentDto[][],
    componentsSuggestionsSet: Set<[string, string]>,
    value: string,
    componentMnemonic?: string,
  ): string {
    if (this.jsonHelperService.hasJsonStructure(value)) {
      let parsedValue = JSON.parse(value);
      // Кейс парсинга значения Repeatable компонентов
      if (repeatableComponents.length && parsedValue.length) {
        parsedValue = Object.values(parsedValue[0])[0];
      }
      value = parsedValue['text'];

      // Кейс парсинга значения для SnilsInput
      if ('snils' in parsedValue) {
        value = parsedValue['snils'];
      }
    }

    const componentsGroupIndex = 0;
    const component = this.findComponent(
      repeatableComponents,
      componentsSuggestionsSet,
      componentMnemonic,
      componentsGroupIndex,
    );
    if (component) {
      value = this.getFormattedValue(component, value, true);
    }

    return value;
  }

  private findComponent(
    repeatableComponents: ComponentDto[][],
    componentsSuggestionsSet: Set<[string, string]>,
    mnemonic: string,
    componentsGroupIndex?: number,
  ): ComponentDto {
    /* Иногда сюда приходит композитный мнемоник вида `zagran_passport.number`, из которого нужно предварительно
    вытащить "родительский" мнемоник, основного компонента, обслуживающий свои филды, например DocInput */
    const [parentMnemonic] = mnemonic.split('.');
    const getComponentDto = (
      componentsList: ComponentDto[],
      parentMnemonic: string,
    ): ComponentDto => {
      return (
        componentsList.find((component: ComponentDto) => {
          return Array.from(componentsSuggestionsSet).some(
            ([componentMnemonic, componentId]) =>
              componentId === component.id && componentMnemonic === parentMnemonic,
          );
        }) ||
        // TODO: небольшой костыль, от которого следует избавиться в ходе глобального рефактора саджестов
        componentsList.find((component: ComponentDto) => {
          return Array.from(componentsSuggestionsSet).some(
            ([componentMnemonic, componentId]) =>
              componentId.includes(component.id) && componentMnemonic === parentMnemonic,
          );
        })
      );
    };

    if (repeatableComponents.length && componentsGroupIndex > -1) {
      return getComponentDto(repeatableComponents[componentsGroupIndex], parentMnemonic);
    } else {
      return getComponentDto(this.screenService.display?.components, parentMnemonic);
    }
  }

  private findComponentValue(
    component: Partial<ComponentDto>,
    id: number,
    value: string,
    mnemonic: string,
    componentsSuggestionsSet: Set<[string, string]>,
  ): string {
    let fieldName: string;

    if (component.type === CustomScreenComponentTypes.DocInput) {
      fieldName = Array.from(componentsSuggestionsSet)
        .find(([suggestId]) => suggestId === mnemonic)[1]
        .split('.')[1];
      value = JSON.stringify({
        ...JSON.parse(component.value),
        [fieldName]: value,
      });
    } else {
      fieldName = Array.from(componentsSuggestionsSet).find(
        ([componentMnemonic]) => componentMnemonic === mnemonic,
      )[1];
    }

    const suggestions =
      this.screenService.suggestions[component?.id] || this.screenService.suggestions[fieldName];
    const result = suggestions?.list.find((item) => {
      if (typeof id === 'number') {
        return item.id === id;
      } else if (item.originalItem.includes(value)) {
        return true;
      } else {
        return item.value === value;
      }
    });

    return result?.originalItem || '';
  }

  private setComponentValue(component: ComponentDto, value: string): void {
    if (component && value) {
      value = this.getFormattedValue(component, value);
      component.value = value;
    }
  }

  // NOTICE: здесь собирается единый контекст для передачи в SelectChildren через механизм cachedAnswers.
  private prepareCachedAnswers(
    parentComponent: ComponentDto,
    component: ComponentDto,
    componentsGroupIndex: number,
    componentValue: string,
  ): Answer {
    const cachedAnswer = this.screenService.cachedAnswers[parentComponent.id];
    const currentAnswerState = (this.currentAnswersService.state as Record<string, string>[]) || [];
    const cachedState = (currentAnswerState && currentAnswerState[componentsGroupIndex]) || {};
    const currentValue = componentValue || component.value;
    if (cachedAnswer) {
      const { value } = cachedAnswer;
      let parsedValue = JSON.parse(value);
      parsedValue = currentAnswerState.map((stateItem, idx) => {
        if (idx !== componentsGroupIndex) {
          return stateItem;
        }
        return parsedValue[idx];
      });
      if (parsedValue[componentsGroupIndex]) {
        parsedValue[componentsGroupIndex] = {
          ...cachedState,
          ...parsedValue[componentsGroupIndex],
          [component.id]: currentValue,
        };
      } else {
        parsedValue[componentsGroupIndex] = { ...cachedState, [component.id]: currentValue };
      }
      cachedAnswer.value = JSON.stringify(parsedValue);
      return cachedAnswer;
    } else {
      let newCachedAnswer = [...currentAnswerState];
      newCachedAnswer[componentsGroupIndex] = { [component.id]: currentValue };
      return {
        value: JSON.stringify(newCachedAnswer),
        visited: true,
      };
    }
  }

  private getFormattedValue(
    component: ComponentDto,
    value: string,
    isFormattedReturn?: boolean,
  ): string {
    if (component.type === CustomScreenComponentTypes.DateInput) {
      let dateValue = (this.datesToolsService.parse(
        value,
        DATE_STRING_DOT_FORMAT,
      ) as unknown) as string;
      if (this.datesToolsService.isValid(dateValue)) {
        return isFormattedReturn
          ? this.datesToolsService.format(dateValue, DATE_STRING_DOT_FORMAT)
          : dateValue;
      } else {
        dateValue = (this.datesToolsService.parse(value) as unknown) as string;
        return isFormattedReturn && this.datesToolsService.isValid(dateValue)
          ? this.datesToolsService.format(dateValue, DATE_STRING_DOT_FORMAT)
          : dateValue;
      }
    } else if (component.type === CustomScreenComponentTypes.DocInput) {
      const dateValue = this.datesToolsService.parse(value);
      if (this.datesToolsService.isValid(dateValue)) {
        return this.datesToolsService.format(dateValue, DATE_STRING_DOT_FORMAT);
      } else {
        return value;
      }
    } else if (component.type === CustomScreenComponentTypes.RadioInput) {
      const componentAttrs = component.attrs as CustomComponentAttr;
      return componentAttrs.supportedValues.find((item) => item.value === value)?.label || value;
    } else if (!!component.attrs.suggestionPath && this.jsonHelperService.hasJsonStructure(value)) {
      const parsedValue = this.jsonHelperService.tryToParse(value);
      return _get(parsedValue, component.attrs.suggestionPath);
    } else if (this.jsonHelperService.hasJsonStructure(value)) {
      const parsedValue = JSON.parse(value);
      if (Array.isArray(parsedValue)) {
        const parsedItem = parsedValue.find((item) => Object.keys(item)[0] === component.id);
        value = parsedItem[component.id];
        return typeof value === 'string' ? value : JSON.stringify(value);
      } else if ('snils' in parsedValue) {
        return parsedValue['snils'];
      }
    }
    return value;
  }
}
