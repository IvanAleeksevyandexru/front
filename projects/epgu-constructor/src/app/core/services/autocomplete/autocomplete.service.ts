import { Injectable } from '@angular/core';
import { distinctUntilKeyChanged, filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalService } from '../../../modal/modal.service';
import { ScreenService } from '../../../screen/screen.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { AutocompleteApiService } from './autocomplete-api.service';
import { ISuggestionItem, ISuggestionApi, ISuggestionItemList } from './autocomplete.inteface';
import { allowedAutocompleteComponentsList, getSuggestionGroupId } from './autocomplete.const';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { DisplayDto } from 'epgu-constructor-types/dist/base/screen';
import { ComponentFieldDto } from 'epgu-constructor-types/dist/base/component-attrs';
import { AutocompleteAutofillService } from './autocomplete-autofill.service';
import { AutocompletePrepareService } from './autocomplete-prepare.service';

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
    private autocompleteAutofillService: AutocompleteAutofillService,
    private autocompletePrepareService: AutocompletePrepareService,
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
        this.suggestionGroupId = getSuggestionGroupId(display);
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

    this.screenService.component$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((component: ComponentDto) => {
        this.parentComponent = component;
      });

    this.eventBusService
      .on('suggestionSelectedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItemList): void => {
        let { mnemonic, value, id, componentsGroupIndex } = payload;

        // с помощью автоподстановки будут заполнены некоторые компоненты.
        // для того, чтобы остальные компоненты не потеряли свои значения мы
        // сохраняем их из currentAnswersService в screenService
        this.autocompletePrepareService.loadValuesFromCurrentAnswer(this.repeatableComponents);

        if (this.suggestionGroupId) {
          Object.keys(this.screenService.suggestions).forEach((componentId: string) => {
            mnemonic = this.screenService.suggestions[componentId].mnemonic;
            this.autocompletePrepareService.findAndUpdateComponentWithValue(
              this.repeatableComponents,
              this.componentsSuggestionsMap,
              this.parentComponent,
              mnemonic,
              value,
              id,
              componentsGroupIndex,
            );
          });
        } else {
          this.autocompletePrepareService.findAndUpdateComponentWithValue(
            this.repeatableComponents,
            this.componentsSuggestionsMap,
            this.parentComponent,
            mnemonic,
            value,
            null,
            componentsGroupIndex,
          );
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

  public getRepeatableComponents(display): Array<Array<ComponentDto>> {
    if (display.components[0]?.attrs?.repeatableComponents) {
      return display.components[0]?.attrs.repeatableComponents;
    } else if (display.components[0]?.attrs?.components) {
      return [display.components[0]?.attrs.components];
    } else {
      return [];
    }
  }

  private groupSuggestionsApiCall(): void {
    this.autocompleteApiService
      .getSuggestionsGroup(this.suggestionGroupId)
      .subscribe((suggestions: ISuggestionApi[]) => {
        this.autocompletePrepareService.formatAndPassDataToSuggestions(
          this.repeatableComponents,
          this.componentsSuggestionsMap,
          suggestions,
        );
        this.autocompleteAutofillService.autofillIfNeeded(this.parentComponent);
      });
  }

  private fieldsSuggestionsApiCall(componentsSuggestionsFieldsIds: string[]): void {
    this.autocompleteApiService
      .getSuggestionsFields(componentsSuggestionsFieldsIds)
      .subscribe((suggestions: ISuggestionApi[]) => {
        this.autocompletePrepareService.formatAndPassDataToSuggestions(
          this.repeatableComponents,
          this.componentsSuggestionsMap,
          suggestions,
        );
        this.autocompleteAutofillService.autofillIfNeeded(this.parentComponent);
      });
  }

  private resetComponentsSuggestionsMap(): void {
    this.componentsSuggestionsMap = {};
    this.suggestionGroupId = null;
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
