import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilKeyChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { DisplayDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { ConfigService } from '../config/config.service';
import { EventBusService } from '../event-bus/event-bus.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { ISuggestionItem, ISuggestionApi, ISuggestionApiFieldsValue, ISuggestionItemList } from './autocomplete.inteface';

@Injectable()
export class AutocompleteService {
  componentsSuggestionsMap: { [key: string]: string } = {};

  constructor(
    private http: HttpClient,
    private screenService: ScreenService,
    private configService: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
  ) { }

  init(): void {
    this.screenService.display$
      .pipe(
        tap(() => this.resetComponentsSuggestionsMap()),
        filter(display => display !== null),
        distinctUntilKeyChanged(('id')),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((display: DisplayDto) => {
        const componentsSuggestionsGroupId: string = this.getComponentsSuggestionsGroupId(display);
        const componentsSuggestionsFieldsIds: string[] = this.getComponentsSuggestionsFieldsIds(display);
        if (componentsSuggestionsGroupId) {
          this.getSuggestionsGroup(componentsSuggestionsGroupId)
            .subscribe((suggestions: ISuggestionApi) => {
              console.log({ suggestions });
              // TODO: добавить парсинг, подготовку и проброс данных на уровень компонентов по componentsSuggestionsMap
            });
          return;
        }
        if (componentsSuggestionsFieldsIds.length) {
          this.getSuggestionsFields(componentsSuggestionsFieldsIds)
            .subscribe((suggestions: ISuggestionApi) => {
              this.formatAndPassDataToComponents(suggestions);
            });
          return;
        }
      });

    this.eventBusService.on('suggestionSelectedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: ISuggestionItemList): void => {
        const mnemonic = payload.mnemonic.split('.')[0];
        const component = this.screenService.display?.components?.find(
          component => component.id === this.componentsSuggestionsMap[mnemonic]
        );

        if (component && payload.value) {
          component.value = payload.value;
        }

        console.log({ payload, component }, this.screenService.display);
        this.screenService.display = { ...this.screenService.display, ...this.screenService.display.components };
      });
  }

  private formatAndPassDataToComponents(suggestions: ISuggestionApi): void {
    let list: ISuggestionItemList[];
    let result: { [key: string]: ISuggestionItem } = {};
    suggestions.fields.forEach((field) => {
      const mnemonic = field.suggestionId;
      const componentId = this.componentsSuggestionsMap[mnemonic];
      list = this.getFormattedList(field.values, mnemonic);
      result[componentId] = {
        mnemonic,
        list
      };
    });
    this.screenService.suggestions = result;
  }

  private getFormattedList(values: ISuggestionApiFieldsValue[], mnemonic: string): ISuggestionItemList[] {
    return values.map((item: ISuggestionApiFieldsValue, idx) => {
      return {
        value: item.value,
        mnemonic: `${mnemonic}.${idx}`,
        hints: []
      };
    });
  }

  private getSuggestionsGroup(
    groupId: string,
    serviceId: string = '11111',
  ): Observable<ISuggestionApi> {
    const searchQuery = `group=${groupId}&serviceId=${serviceId}`;
    const path = `${this.configService.suggestionsApiUrl}?${searchQuery}`;
    return this.httpGet<ISuggestionApi>(path);
  }

  private getSuggestionsFields(
    fields: Array<string>,
    serviceId: string = '11111',
  ): Observable<ISuggestionApi> {
    const searchQuery = fields
      .map((field) => 'fields=' + field)
      .join('&')
      .concat('&serviceId=' + serviceId);
    const path = `${this.configService.suggestionsApiUrl}?${searchQuery}`;
    return this.httpGet<ISuggestionApi>(path);
  }

  private resetComponentsSuggestionsMap(): void {
    this.componentsSuggestionsMap = null;
    this.componentsSuggestionsMap = {};
  }

  private getComponentsSuggestionsGroupId(display: DisplayDto): string {
    const groupId = display.suggestion?.groupId;
    this.getComponentsSuggestionsFieldsIds(display);
    this.componentsSuggestionsMap[groupId] = display.id;
    return groupId;
  }

  private getComponentsSuggestionsFieldsIds(display: DisplayDto): string[] {
    return display.components
      .filter((component) => component.attrs?.suggestionId)
      .map((component) => {
        const suggestionId = component.attrs?.suggestionId;
        this.componentsSuggestionsMap[suggestionId] = component.id;
        return suggestionId;
      });
  }

  private httpGet<T>(path: string): Observable<T> {
    return this.http.get<T>(path, {
      // withCredentials: true,
    });
  }
}
