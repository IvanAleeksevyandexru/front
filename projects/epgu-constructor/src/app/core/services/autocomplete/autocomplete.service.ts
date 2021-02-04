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
import { AutocompleteApiService } from './autocomplete-api.service';
import {
  ISuggestionItem,
  ISuggestionApi,
  ISuggestionApiField,
  ISuggestionApiFieldsValue,
  ISuggestionApiGroupValue,
  ISuggestionItemList,
} from './autocomplete.inteface';

@Injectable()
export class AutocompleteService {
  componentsSuggestionsMap: { [key: string]: string[] } = {};
  groupId: string = null;

  constructor(
    private screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private modalService: ModalService,
    private autocompleteApiService: AutocompleteApiService,
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
          this.autocompleteApiService.getSuggestionsGroup(this.groupId).subscribe((suggestions: ISuggestionApi) => {
            this.formatAndPassDataToComponents(suggestions);
          });
          return;
        }
        if (componentsSuggestionsFieldsIds.length) {
          this.autocompleteApiService.getSuggestionsFields(componentsSuggestionsFieldsIds).subscribe(
            (suggestions: ISuggestionApi) => {
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
        let [mnemonic] = payload.mnemonic.split('.');
        let { value, groupIdx } = payload;
        let component: ComponentDto;

        if (this.groupId && groupIdx >= 0) {
          Object.keys(this.screenService.suggestions).forEach((componentId) => {
            mnemonic = this.screenService.suggestions[componentId].mnemonic;
            component = this.findComponent(mnemonic);
            value = this.screenService.suggestions[component.id]?.list[groupIdx]?.value;
            this.setComponentValue(component, value);
          });
        } else {
          component = this.findComponent(mnemonic);
          this.setComponentValue(component, value);
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

  private findComponent(mnemonic: string): ComponentDto {
    return this.screenService.display?.components?.find((component) => {
      return this.findComponentByMnemonic(mnemonic, component);
    });
  }

  private findComponentByMnemonic(componentMnemonic: string, component: ComponentDto): boolean {
    return this.componentsSuggestionsMap[componentMnemonic].some(
      (componentId) => component.id === componentId
    );
  }

  private setComponentValue(component: ComponentDto, value: string): void {
    if (component && value) {
      component.presetValue = value;
      component.value = value;
    }
  }

  private formatAndPassDataToComponents(suggestions: ISuggestionApi): void {
    let list: ISuggestionItemList[];
    let result: { [key: string]: ISuggestionItem } = {};
    let hints: ISuggestionApiGroupValue[][] = [];
    const isGroupSuggest = suggestions.groups?.length;
    if (isGroupSuggest) {
      const [groupItem] = suggestions.groups;
      const { values } = groupItem;
      hints = values;
      suggestions.fields = values.reduce(
        (acc: ISuggestionApiField[], item, groupIdx): ISuggestionApiField[] => {
          let suggestionFieldItem: ISuggestionApiField = null;
          item.forEach((field) => {
            const { suggestionId, value } = field;
            const existingItem = acc.find(
              (suggestItem) => suggestItem.suggestionId === suggestionId,
            );
            if (existingItem) {
              existingItem.values.push({ value, groupIdx });
            } else {
              suggestionFieldItem = {
                suggestionId,
                values: [{ value, groupIdx }],
              };
              acc.push(suggestionFieldItem);
            }
          });
          return acc;
        },
        [],
      );
    }

    suggestions.fields.forEach((field) => {
      const mnemonic = field.suggestionId;
      const componentsIds: string[] = this.componentsSuggestionsMap[mnemonic];
      list = this.getFormattedList(field.values, mnemonic, hints);
      if (componentsIds) {
        componentsIds.forEach((componentId: string) => {
          result[componentId] = {
            mnemonic,
            list,
          };
        });
      }
    });

    this.screenService.suggestions = result;
  }

  private getFormattedList(
    values: ISuggestionApiFieldsValue[],
    mnemonic: string,
    _hints: ISuggestionApiGroupValue[][] = [],
  ): ISuggestionItemList[] {
    const hints: { value: string; mnemonic: string }[][] = this.getFormattedHints(_hints, mnemonic);
    return values.map((item: ISuggestionApiFieldsValue) => {
      const { value, groupIdx } = item;
      return {
        value,
        mnemonic: `${mnemonic}.${groupIdx}`,
        hints: hints[groupIdx],
        groupIdx,
      };
    });
  }

  private getFormattedHints(_hints: ISuggestionApiGroupValue[][], mnemonic: string): { value: string; mnemonic: string; }[][] {
    return _hints.reduce(
      (acc: { value: string; mnemonic: string; }[][], hint) => {
        const result: Array<{ value: string; mnemonic: string; }> = hint.reduce(
          (hintAcc, item: ISuggestionApiGroupValue): Array<{ value: string; mnemonic: string; }> => {
            if (item.suggestionId !== mnemonic) {
              hintAcc.push({
                value: item.value,
                mnemonic: item.suggestionId,
              });
            }
            return hintAcc;
          },
          []
        );
        acc.push(result);
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
      .filter((component) => component.attrs?.suggestionId)
      .map((component) => {
        const suggestionId = component.attrs?.suggestionId;
        if (!this.componentsSuggestionsMap[suggestionId]) {
          this.componentsSuggestionsMap[suggestionId] = [];
        }
        this.componentsSuggestionsMap[suggestionId].push(component.id);
        return suggestionId;
      });
  }
}
