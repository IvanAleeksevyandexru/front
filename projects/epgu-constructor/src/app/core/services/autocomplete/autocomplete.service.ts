import { Injectable } from '@angular/core';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';
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
  ISuggestionApiValue,
} from './autocomplete.inteface';

@Injectable()
export class AutocompleteService {
  componentsSuggestionsMap: { [key: string]: string } = {};
  groupId: string = null;

  constructor(
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private modalService: ModalService,
    private autocompleteApiService: AutocompleteApiService,
    private utilsService: UtilsService,
  ) {}

  init(): void {
    this.screenService.display$
      .pipe(
        filter((display) => display !== null),
        distinctUntilKeyChanged('id'),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((display: DisplayDto) => {
        this.resetComponentsSuggestionsMap();
        this.groupId = this.getComponentsSuggestionsGroupId(display);
        const componentsSuggestionsFieldsIds: string[] = this.getComponentsSuggestionsFieldsIds(
          display,
        );

        if (this.groupId) {
          this.autocompleteApiService.getSuggestionsGroup(this.groupId).subscribe((suggestions: ISuggestionApi[]) => {
            const isMultiple = true;
            this.formatAndPassDataToComponents(suggestions, isMultiple);
          });
          return;
        }
        if (componentsSuggestionsFieldsIds.length) {
          this.autocompleteApiService.getSuggestionsFields(componentsSuggestionsFieldsIds).subscribe(
            (suggestions: ISuggestionApi[]) => {
              this.formatAndPassDataToComponents(suggestions);
            },
          );
          return;
        }
      });

    this.eventBusService
      .on('suggestionSelectedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItemList): void => {
        let { mnemonic, value, id } = payload;
        let component: ComponentDto;

        if (this.groupId) {
          Object.keys(this.screenService.suggestions).forEach((componentId: string) => {
            mnemonic = this.screenService.suggestions[componentId].mnemonic;
            ({ component, value } = this.findAndUpdateComponentWithValue(component, mnemonic, value, id));
          });
        } else {
          ({ component, value } = this.findAndUpdateComponentWithValue(component, mnemonic, value, id));
        }

        this.screenService.updateScreenContent(this.screenService);
      });

    this.eventBusService
      .on('suggestionsEditEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItem) => {
        const text = payload.list.reduce((acc, item: ISuggestionItemList): string => {
          const hints = item.hints.map((hint) => hint.value).join(' ');
          const { value, mnemonic } = item;
          const html = `
          <div class="suggest-item">
            <div>${value}</div>
            <div class="suggest-hint">${hints}</div>
            <button class="suggest-delete" data-action-type="deleteSuggest" data-action-value="${mnemonic+':'+value}">
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
  }

  private findAndUpdateComponentWithValue(component: ComponentDto, mnemonic: string, value: string, id: number) {
    component = this.findComponent(mnemonic);
    value = this.screenService.suggestions[component.id]?.list.find(item =>
      item.id === id || item.value === value
    )?.originValue || '';
    this.setComponentValue(component, value);
    return { component, value };
  }

  private findComponent(mnemonic: string): ComponentDto {
    return this.screenService.display?.components?.find((component) => {
      return this.componentsSuggestionsMap[mnemonic] === component.id;
    });
  }


  private setComponentValue(component: ComponentDto, value: string): void {
    if (component && value) {
      component.presetValue = value;
      component.value = value;
    }
  }

  private formatAndPassDataToComponents(suggestions: ISuggestionApi[], isMultiple?: boolean): void {
    let result: { [key: string]: ISuggestionItem } = {};

    suggestions.forEach((suggestion) => {
      const { values } = suggestion;
      const componentsEntries = Object.entries(this.componentsSuggestionsMap) || [];
      values.forEach((value) => {
        const { fields, id } = value;
        componentsEntries.forEach(([componentMnemonic, componentId]) => {
          const componentList: ISuggestionItemList = this.getFormattedList(fields, id, componentMnemonic/* , hints */);
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
      let originValue = value;
      if (this.utilsService.hasJsonStructure(value)) {
        originValue = value;
        const parsedValue = JSON.parse(value)
        value = parsedValue['text'];
      }
      return {
        value,
        mnemonic,
        originValue,
        id,
        hints,
      };
    } else {
      return null;
    }
  }

  private getFormattedHints(fields: ISuggestionApiValueField[], componentMnemonic: string): { value: string; mnemonic: string; }[] {
    const isIncludedInComponentsSuggestionsMap = (mnemonic: string) => {
      return Object.keys(this.componentsSuggestionsMap).includes(mnemonic);
    };

    return fields.reduce(
      (acc: { value: string; mnemonic: string; }[], field) => {
        const { value, mnemonic } = field;
        if (mnemonic !== componentMnemonic && isIncludedInComponentsSuggestionsMap(mnemonic)) {
          acc.push({
            value,
            mnemonic,
          })
        }
        return acc;
      },
      []
    );
  }

  private resetComponentsSuggestionsMap(): void {
    this.componentsSuggestionsMap = null;
    this.componentsSuggestionsMap = {};
    this.groupId = null;
  }

  private getComponentsSuggestionsGroupId(display: DisplayDto): string {
    return display.suggestion?.groupId || null;
  }

  private getComponentsSuggestionsFieldsIds(display: DisplayDto): string[] {
    return display.components
      .filter((component) => component.suggestionId)
      .map((component) => {
        const { suggestionId } = component;
        this.componentsSuggestionsMap[suggestionId] = component.id;
        return suggestionId;
      });
  }
}
