import { Injectable } from '@angular/core';
import { Answer, ComponentDto } from '@epgu/epgu-constructor-types';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { UploadedFile } from '../terra-byte-api/terra-byte-api.types';
import { UtilsService } from '../utils/utils.service';
import { isChildrenListType } from './autocomplete.const';
import { cloneDeep as _cloneDeep } from 'lodash';
import {
  ISuggestionApi,
  ISuggestionApiValueField,
  ISuggestionItem,
  ISuggestionItemList,
} from './autocomplete.inteface';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';

@Injectable()
export class AutocompletePrepareService {
  constructor(
    private screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private datesToolsService: DatesToolsService,
  ) {}

  public getFormattedList(
    repeatableComponents: Array<Array<ComponentDto>>,
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
      value = this.prepareValue(repeatableComponents, componentsSuggestionsSet, value);
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

  public getFormattedHints(
    repeatableComponents: Array<Array<ComponentDto>>,
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
        if (mnemonic !== componentMnemonic && isIncludedInComponentsSuggestionsMap(mnemonic)) {
          value = this.prepareValue(repeatableComponents, componentsSuggestionsSet, value);
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
    repeatableComponents: Array<Array<ComponentDto>>,
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
    repeatableComponents: Array<Array<ComponentDto>>,
    componentsSuggestionsSet: Set<[string, string]>,
    parentComponent: ComponentDto,
    value: string,
    id?: number,
    componentsGroupIndex?: number,
  ): void {
    const component = this.findComponent(
      repeatableComponents,
      componentsSuggestionsSet,
      componentsGroupIndex,
    );
    const componentValue = this.findComponentValue(component, id, value);
    this.setComponentValue(component, componentValue);
    if (isChildrenListType(parentComponent)) {
      this.screenService.cachedAnswers[parentComponent.id] = this.prepareCachedAnswers(
        parentComponent,
        component,
        componentsGroupIndex,
      );
    }
  }

  /**
   * Записывает данные из currentAnswersService в screenService. Это делается для того, чтобы
   * введенные пользователем данные не потерялись после вызова screenService.updateScreenContent()
   */
  public loadValuesFromCurrentAnswer(repeatableComponents): void {
    if (repeatableComponents.length) {
      let currentAnswerParsedValue;
      if (UtilsService.hasJsonStructure(this.currentAnswersService.state as string)) {
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
      });
    } else {
      for (const component of this.screenService.display.components) {
        component.value = this.currentAnswersService.state[component.id]?.value || '';
      }
    }
  }

  private prepareValue(
    repeatableComponents: Array<Array<ComponentDto>>,
    componentsSuggestionsSet: Set<[string, string]>,
    value: string,
  ): string {
    if (UtilsService.hasJsonStructure(value)) {
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
      componentsGroupIndex,
    );
    if (component) {
      value = this.getDateValueIfDateInput(component, value, true);
    }

    return value;
  }

  private findComponent(
    repeatableComponents: Array<Array<ComponentDto>>,
    componentsSuggestionsSet: Set<[string, string]>,
    componentsGroupIndex?: number,
  ): ComponentDto {
    /* Иногда сюда приходит композитный мнемоник вида `zagran_passport.number`, из которого нужно предварительно
    вытащить "родительский" мнемоник, основного компонента, обслуживающий свои филды, например DocInput */
    if (repeatableComponents.length && componentsGroupIndex > -1) {
      return repeatableComponents[componentsGroupIndex].find((component) => {
        return Array.from(componentsSuggestionsSet).some(
          ([_, componentId]) => componentId === component.id,
        );
      });
    } else {
      return this.screenService.display?.components?.find((component) => {
        return Array.from(componentsSuggestionsSet).some(
          ([_, componentId]) => componentId === component.id,
        );
      });
    }
  }

  private findComponentValue(component: Partial<ComponentDto>, id: number, value: string): string {
    const result =
      component &&
      this.screenService.suggestions[component.id]?.list.find((item) => {
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
      value = this.getDateValueIfDateInput(component, value);

      // обработка кейса для компонентов, участвующих в RepeatableFields компоненте
      if (UtilsService.hasJsonStructure(value)) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          const parsedItem = parsedValue.find((item) => Object.keys(item)[0] === component.id);
          value = JSON.stringify(parsedItem[component.id]);
        } else if ('snils' in parsedValue) {
          value = parsedValue['snils'];
        }
      }

      component.value = value;
    }
  }

  // TODO: ниже - боль, которая вызвана присутствием всего лишь одного UNIQUE-компонента - SelectChildren,
  // под который нужно пилить свое кастомное решение для проброса в компонент выбранного саджеста.
  // Если в двух словах, то здесь просто собирается единый контекст из разных ошметков в разных местах.
  // В перспективе - это нужно упразднить в ходе перевода SelectChildren на RepeatableScreens
  private prepareCachedAnswers(
    parentComponent: ComponentDto,
    component: ComponentDto,
    componentsGroupIndex: number,
  ): Answer {
    const cachedAnswer = this.screenService.cachedAnswers[parentComponent.id];
    if (cachedAnswer) {
      const { value } = cachedAnswer;
      let parsedValue = JSON.parse(value);
      const cachedState = this.currentAnswersService.state[componentsGroupIndex];
      if (parsedValue[componentsGroupIndex]) {
        parsedValue[componentsGroupIndex] = {
          ...cachedState,
          ...parsedValue[componentsGroupIndex],
          [component.id]: component.value,
        };
      } else {
        parsedValue[componentsGroupIndex] = { ...cachedState, [component.id]: component.value };
      }
      cachedAnswer.value = JSON.stringify(parsedValue);
      return cachedAnswer;
    } else {
      return {
        value: JSON.stringify([{ [component.id]: component.value }]),
        visited: true,
      };
    }
  }

  private getDateValueIfDateInput(
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
    }
    return value;
  }
}
