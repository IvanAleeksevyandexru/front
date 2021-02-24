import { Injectable } from '@angular/core';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';
import { cloneDeep as _cloneDeep } from 'lodash';
import {
  ComponentDto,
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
import { CustomScreenComponentTypes } from '../../../component/shared/components/components-list/components-list.types';
import { DatesToolsService } from '../dates-tools/dates-tools.service';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';
import { CurrentAnswersService } from '../../../screen/current-answers.service';

@Injectable()
export class AutocompleteService {
  componentsSuggestionsMap: { [key: string]: string } = {};
  suggestionGroupId: string = null;
  repeatableComponents: Array<Array<ComponentDto>> = [];

  constructor(
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private modalService: ModalService,
    private autocompleteApiService: AutocompleteApiService,
    private utilsService: UtilsService,
    private datesToolsService: DatesToolsService,
    private currentAnswersService: CurrentAnswersService,
  ) {}

  public init(): void {
    this.screenService.display$
      .pipe(
        filter((display) => display !== null),
        distinctUntilKeyChanged('id'),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((display: DisplayDto) => {
        this.resetComponentsSuggestionsMap();
        this.suggestionGroupId = this.getSuggestionGroupId(display);
        this.repeatableComponents = display.components[0]?.attrs?.repeatableComponents || [];
        const componentsSuggestionsFieldsIds: string[] = this.getComponentsSuggestionsFieldsIds(
          display,
        ) || [];

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

        this.screenService.updateScreenContent(this.screenService);
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
            <button class="suggest-delete" data-action-type="deleteSuggest" data-action-value="${mnemonic+':'+value+':'+id}">
            </button>
          </div>
          `;
          return acc.concat(html);
        }, '');
        this.modalService.openModal(ConfirmationModalComponent,
          {
            title: 'Ранее заполненные данные',
            text,
            showCloseButton: true,
            showCrossButton: true,
            isShortModal: true,
          }
        );
      });

      this.eventBusService
        .on('suggestionDeleteEvent')
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((payload: ISuggestionItemList): void => {
          let { mnemonic } = payload;

          if (this.suggestionGroupId) {
            this.groupSuggestionsApiCall();
          } else {
            this.fieldsSuggestionsApiCall([mnemonic]);
          }
        });
  }

  /**
   * Записывает данные из currentAnswersService в screenService. Это делается для того, чтобы
   * введенные пользователем данные не потерялись после вызова screenService.updateScreenContent()
   */
  private loadValuesFromCurrentAnswer(): void {
    if (this.repeatableComponents.length) {
      const currentAnswerParsedValue = JSON.parse(this.currentAnswersService.state as string);

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
    this.autocompleteApiService.getSuggestionsGroup(this.suggestionGroupId).subscribe((suggestions: ISuggestionApi[]) => {
      this.formatAndPassDataToComponents(suggestions);
    });
  }

  private fieldsSuggestionsApiCall(componentsSuggestionsFieldsIds: string[]): void {
    this.autocompleteApiService.getSuggestionsFields(componentsSuggestionsFieldsIds).subscribe(
      (suggestions: ISuggestionApi[]) => {
        this.formatAndPassDataToComponents(suggestions);
      }
    );
  }

  private findAndUpdateComponentWithValue(mnemonic: string, value: string, id?: number, componentsGroupIndex?: number): void {
    const component = this.findComponent(mnemonic, componentsGroupIndex);
    const componentValue = this.findComponentValue(component, id, value);
    this.setComponentValue(component, componentValue);
  }

  private findComponentValue(component: ComponentDto, id: number, value: string): string {
    const result = component &&  this.screenService.suggestions[component.id]?.list.find(item => {
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
    if (this.repeatableComponents.length) {
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
      if (component.type === CustomScreenComponentTypes.DateInput) {
        value = (this.datesToolsService.parse(value, DATE_STRING_DOT_FORMAT) as unknown) as string;
      }

      // обработка кейса для компонентов, участвующих в RepeatableFields компоненте
      if (this.utilsService.hasJsonStructure(value)) {
        const parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          const parsedlItem = parsedValue.find(item => Object.keys(item)[0] === component.id);
          value = JSON.stringify(parsedlItem[component.id]);
        }
      }

      component.value = value;
    }
  }

  private formatAndPassDataToComponents(suggestions: ISuggestionApi[]): void {
    let result: { [key: string]: ISuggestionItem } = {};

    suggestions.forEach((suggestion) => {
      const { values } = suggestion;
      const componentsEntries = Object.entries(this.componentsSuggestionsMap) || [];
      values.forEach((value) => {
        const { fields, id } = value;
        componentsEntries.forEach(([componentMnemonic, componentId]) => {
          const componentList: ISuggestionItemList = this.getFormattedList(fields, id, componentMnemonic);
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
    const hints: { value: string; mnemonic: string }[] = this.getFormattedHints(fields, componentMnemonic);
    const field = fields.find((field: ISuggestionApiValueField) => field.mnemonic === componentMnemonic);
    if (field) {
      let { value, mnemonic } = field;
      let originalItem = value;
      value = this.prepareValue(value);
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

  private getFormattedHints(fields: ISuggestionApiValueField[], componentMnemonic: string): { value: string; mnemonic: string; }[] {
    const isIncludedInComponentsSuggestionsMap = (mnemonic: string): boolean => {
      return Object.keys(this.componentsSuggestionsMap).includes(mnemonic);
    };

    return fields.reduce(
      (acc: { value: string; mnemonic: string; }[], field) => {
        let { value, mnemonic } = field;
        if (mnemonic !== componentMnemonic && isIncludedInComponentsSuggestionsMap(mnemonic)) {
          value = this.prepareValue(value);
          acc.push({
            value,
            mnemonic,
          });
        }
        return acc;
      },
      []
    );
  }

  private prepareValue(value: string): string {
    if (this.utilsService.hasJsonStructure(value)) {
      let parsedValue = JSON.parse(value);
      if (this.repeatableComponents.length && parsedValue.length) {
        parsedValue = Object.values(parsedValue[0])[0];
      }
      value = parsedValue['text'];
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
          if (component.type === CustomScreenComponentTypes.DocInput) {
            Object.keys(fields).forEach(fieldName => {
              const field = fields[fieldName];
              const fieldSuggestionId = field?.attrs.suggestionId;
              if (fieldSuggestionId) {
                this.componentsSuggestionsMap[fieldSuggestionId] = `${component.id}.${fieldName}`;
                fieldSuggestionIdsSet.add(fieldSuggestionId);
              }
            });
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
}
