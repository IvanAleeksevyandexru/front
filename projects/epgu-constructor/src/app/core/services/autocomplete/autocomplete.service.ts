import { Injectable } from '@angular/core';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';
import { cloneDeep as _cloneDeep } from 'lodash';
import {
  ComponentDto,
  ComponentFieldDto,
  DisplayDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../modal/modal.service';
import { ScreenService } from '../../../screen/screen.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { UtilsService } from '../utils/utils.service';
import { AutocompleteApiService } from './autocomplete-api.service';
import {
  ISuggestionItem,
  ISuggestionApi,
  ISuggestionApiValueField,
  ISuggestionItemList,
} from './autocomplete.inteface';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { UploadedFile } from '../terra-byte-api/terra-byte-api.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { Answer } from '../../../shared/types/answer';
import { allowedAutocompleteComponentsList } from './autocomplete.const';

@Injectable()
export class AutocompleteService {
  componentsSuggestionsMap: { [key: string]: string } = {};
  suggestionGroupId: string = null;
  repeatableComponents: Array<Array<ComponentDto>> = [];
  parentComponent: ComponentDto = null;

  constructor(
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private modalService: ModalService,
    private autocompleteApiService: AutocompleteApiService,
    private datesToolsService: DatesToolsService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  public init(isDisabled: boolean = false): void {
    if (isDisabled) return;

    this.screenService.display$
      .pipe(
        filter((display) => display !== null),
        distinctUntilKeyChanged('id'),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((display: DisplayDto): void => {
        this.resetComponentsSuggestionsMap();
        this.parentComponent = display.components[0];
        this.suggestionGroupId = this.getSuggestionGroupId(display);
        this.repeatableComponents = this.getRepeatableComponents(display);
        const componentsSuggestionsFieldsIds: string[] =
          this.getComponentsSuggestionsFieldsIds(display) || [];

        if (this.suggestionGroupId) {
          this.groupSuggestionsApiCall();
          return;
        }
        if (componentsSuggestionsFieldsIds.length) {
          this.fieldsSuggestionsApiCall(componentsSuggestionsFieldsIds);
          return;
        }
      });

    this.eventBusService
      .on('suggestionSelectedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItemList): void => {
        let { mnemonic, value, id, componentsGroupIndex } = payload;

        // с помощью автоподстановки будут заполнены некоторые компоненты.
        // для того, чтобы остальные компоненты не потеряли свои значения мы
        // сохраняем их из currentAnswersService в screenService
        this.loadValuesFromCurrentAnswer();

        if (this.suggestionGroupId) {
          Object.keys(this.screenService.suggestions).forEach((componentId: string) => {
            mnemonic = this.screenService.suggestions[componentId].mnemonic;
            this.findAndUpdateComponentWithValue(mnemonic, value, id, componentsGroupIndex);
          });
        } else {
          this.findAndUpdateComponentWithValue(mnemonic, value, null, componentsGroupIndex);
        }

        this.screenService.updateScreenStore(this.screenService);
      });

    this.eventBusService
      .on('suggestionsEditEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItem) => {
        const text = payload.list.reduce((acc, item: ISuggestionItemList): string => {
          const hints = item.hints.map((hint) => hint.value).join(' ');
          const { value, mnemonic, id } = item;
          const html = `
          <div class="suggest-item">
            <div>${value}</div>
            <div class="suggest-hint">${hints}</div>
            <button class="suggest-delete" data-action-type="deleteSuggest" data-action-value="${
              mnemonic + ':' + value + ':' + id
            }">
            </button>
          </div>
          `;
          return acc.concat(html);
        }, '');
        this.modalService.openModal(ConfirmationModalComponent, {
          title: 'Ранее заполненные данные',
          text,
          showCloseButton: true,
          showCrossButton: true,
          isShortModal: true,
        });
      });

    this.eventBusService
      .on('suggestionDeleteEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItemList): void => {
        const { mnemonic } = payload;

        if (this.suggestionGroupId) {
          this.groupSuggestionsApiCall();
        } else {
          this.fieldsSuggestionsApiCall([mnemonic]);
        }
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

  public getRepeatableComponents(display): Array<Array<ComponentDto>> {
    if (display.components[0]?.attrs?.repeatableComponents) {
      return display.components[0]?.attrs.repeatableComponents;
    } else if (display.components[0]?.attrs?.components) {
      return [display.components[0]?.attrs.components];
    } else {
      return [];
    }
  }

  public isChildrenListType(): boolean {
    return [
      UniqueScreenComponentTypes.childrenList,
      UniqueScreenComponentTypes.childrenListAbove14,
      UniqueScreenComponentTypes.childrenListUnder14,
    ].includes(this.parentComponent?.type as UniqueScreenComponentTypes);
  }

  /**
   * Записывает данные из currentAnswersService в screenService. Это делается для того, чтобы
   * введенные пользователем данные не потерялись после вызова screenService.updateScreenContent()
   */
  private loadValuesFromCurrentAnswer(): void {
    if (this.repeatableComponents.length) {
      let currentAnswerParsedValue;
      if (UtilsService.hasJsonStructure(this.currentAnswersService.state as string)) {
        currentAnswerParsedValue = JSON.parse(this.currentAnswersService.state as string);
      } else {
        currentAnswerParsedValue = this.currentAnswersService.state;
      }

      // оставляем первый элемент, чтобы правильно обрабатывалось удаление пользователем repeatable fields
      this.repeatableComponents.splice(1);

      currentAnswerParsedValue.forEach((currentAnswerItem: unknown, index: number) => {
        if (!this.repeatableComponents[index]) {
          const repeatableComponentsItemClone = _cloneDeep(this.repeatableComponents[0]);
          this.repeatableComponents.push(repeatableComponentsItemClone);
        }

        for (const repeatableComponentItem of this.repeatableComponents[index]) {
          repeatableComponentItem.value = currentAnswerItem[repeatableComponentItem.id];
        }
      });
    } else {
      for (const component of this.screenService.display.components) {
        component.value = this.currentAnswersService.state[component.id]?.value || '';
      }
    }
  }

  private groupSuggestionsApiCall(): void {
    this.autocompleteApiService
      .getSuggestionsGroup(this.suggestionGroupId)
      .subscribe((suggestions: ISuggestionApi[]) => {
        this.formatAndPassDataToSuggestions(suggestions);
      });
  }

  private fieldsSuggestionsApiCall(componentsSuggestionsFieldsIds: string[]): void {
    this.autocompleteApiService
      .getSuggestionsFields(componentsSuggestionsFieldsIds)
      .subscribe((suggestions: ISuggestionApi[]) => {
        this.formatAndPassDataToSuggestions(suggestions);
      });
  }

  private findAndUpdateComponentWithValue(
    mnemonic: string,
    value: string,
    id?: number,
    componentsGroupIndex?: number,
  ): void {
    const component = this.findComponent(mnemonic, componentsGroupIndex);
    const componentValue = this.findComponentValue(component, id, value);
    this.setComponentValue(component, componentValue);
    if (this.isChildrenListType()) {
      this.screenService.cachedAnswers[this.parentComponent.id] = this.prepareCachedAnswers(
        component,
        componentsGroupIndex,
      );
    }
  }

  // TODO: ниже - боль, которая вызвана присутствием всего лишь одного UNIQUE-компонента - SelectChildren,
  // под который нужно пилить свое кастомное решение для проброса в компонент выбранного саджеста.
  // Если в двух словах, то здесь просто собирается единый контекст из разных ошметков в разных местах.
  // В перспективе - это нужно упразднить в ходе перевода SelectChildren на RepeatableScreens
  private prepareCachedAnswers(component: ComponentDto, componentsGroupIndex: number): Answer {
    const cachedAnswer = this.screenService.cachedAnswers[this.parentComponent.id];
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

  private findComponent(mnemonic: string, componentsGroupIndex?: number): ComponentDto {
    /* Иногда сюда приходит композитный мнемоник вида `zagran_passport.number`, из которого нужно предварительно
    вытащить "родительский" мнемоник, основного компонента, обслуживающий свои филды, например DocInput */
    const [componentMnemonic] = mnemonic.split('.');
    if (this.repeatableComponents.length && componentsGroupIndex > -1) {
      return this.repeatableComponents[componentsGroupIndex].find((component) => {
        return this.componentsSuggestionsMap[componentMnemonic] === component.id;
      });
    } else {
      return this.screenService.display?.components?.find((component) => {
        return this.componentsSuggestionsMap[componentMnemonic] === component.id;
      });
    }
  }

  private setComponentValue(component: ComponentDto, value: string): void {
    if (component && value) {
      value = this.getDateValueIfDateInput(component, value);

      // обработка кейса для компонентов, участвующих в RepeatableFields компоненте
      if (UtilsService.hasJsonStructure(value)) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          const parsedlItem = parsedValue.find((item) => Object.keys(item)[0] === component.id);
          value = JSON.stringify(parsedlItem[component.id]);
        }
      }

      component.value = value;
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
        return isFormattedReturn
          ? this.datesToolsService.format(dateValue, DATE_STRING_DOT_FORMAT)
          : dateValue;
      }
    }
    return value;
  }

  private formatAndPassDataToSuggestions(suggestions: ISuggestionApi[]): void {
    let result: { [key: string]: ISuggestionItem } = {};

    suggestions.forEach((suggestion) => {
      const { values } = suggestion;
      const componentsEntries = Object.entries(this.componentsSuggestionsMap) || [];
      values.forEach((value) => {
        const { fields, id } = value;
        componentsEntries.forEach(([componentMnemonic, componentId]) => {
          const componentList: ISuggestionItemList = this.getFormattedList(
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

  private getFormattedList(
    fields: ISuggestionApiValueField[],
    id: number,
    componentMnemonic: string,
  ): ISuggestionItemList {
    const hints: { value: string; mnemonic: string }[] = this.getFormattedHints(
      fields,
      componentMnemonic,
    );
    const field = fields.find(
      (field: ISuggestionApiValueField) => field.mnemonic === componentMnemonic,
    );
    if (field) {
      let { value, mnemonic } = field;
      let originalItem = value;
      value = this.prepareValue(value, mnemonic);
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

  private getFormattedHints(
    fields: ISuggestionApiValueField[],
    componentMnemonic: string,
  ): { value: string; mnemonic: string }[] {
    const isIncludedInComponentsSuggestionsMap = (mnemonic: string): boolean => {
      return Object.keys(this.componentsSuggestionsMap).includes(mnemonic);
    };

    return fields.reduce((acc: { value: string; mnemonic: string }[], field) => {
      let { value, mnemonic } = field;
      if (mnemonic !== componentMnemonic && isIncludedInComponentsSuggestionsMap(mnemonic)) {
        value = this.prepareValue(value, mnemonic);
        acc.push({
          value,
          mnemonic,
        });
      }
      return acc;
    }, []);
  }

  private prepareValue(value: string, componentMnemonic?: string): string {
    if (UtilsService.hasJsonStructure(value)) {
      let parsedValue = JSON.parse(value);
      if (this.repeatableComponents.length && parsedValue.length) {
        parsedValue = Object.values(parsedValue[0])[0];
      }
      value = parsedValue['text'];
    }

    const componentsGroupIndex = 0;
    const component = this.findComponent(componentMnemonic, componentsGroupIndex);
    if (component) {
      value = this.getDateValueIfDateInput(component, value, true);
    }

    return value;
  }

  private resetComponentsSuggestionsMap(): void {
    this.componentsSuggestionsMap = {};
    this.suggestionGroupId = null;
  }

  private getSuggestionGroupId(display: DisplayDto): string {
    return display.suggestion?.groupId;
  }

  private getComponentsSuggestionsFieldsIds(display: DisplayDto): string[] {
    const getSuggestionsIds = (components: ComponentDto[]): string[] => {
      let fieldSuggestionIdsSet: Set<string> = new Set();
      const result = components
        .filter((component) => component.suggestionId)
        .map((component) => {
          const { suggestionId } = component;
          const { fields } = component.attrs;
          this.componentsSuggestionsMap[suggestionId] = component.id;
          if (allowedAutocompleteComponentsList(component)) {
            if (Array.isArray(fields)) {
              fields.forEach((field: ComponentFieldDto) => {
                const fieldSuggestionId = field.suggestionId;
                this.setFieldsSuggestionIds(
                  fieldSuggestionId,
                  component.id,
                  field.fieldName,
                  fieldSuggestionIdsSet,
                );
              });
            } else {
              Object.keys(fields).forEach((fieldName) => {
                const field: { attrs: { suggestionId: string } } = fields[fieldName];
                const fieldSuggestionId = field?.attrs.suggestionId;
                this.setFieldsSuggestionIds(
                  fieldSuggestionId,
                  component.id,
                  fieldName,
                  fieldSuggestionIdsSet,
                );
              });
            }
          }
          return suggestionId;
        });
      return [...result, ...Array.from(fieldSuggestionIdsSet)];
    };

    if (this.repeatableComponents.length) {
      return getSuggestionsIds(this.repeatableComponents[0]);
    } else {
      return getSuggestionsIds(display.components);
    }
  }

  private setFieldsSuggestionIds(
    fieldSuggestionId: string,
    componentId: ComponentDto['id'],
    fieldName: string,
    fieldSuggestionIdsSet: Set<string>,
  ): void {
    if (fieldSuggestionId) {
      this.componentsSuggestionsMap[fieldSuggestionId] = `${componentId}.${fieldName}`;
      fieldSuggestionIdsSet.add(fieldSuggestionId);
    }
  }
}
