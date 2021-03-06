import { Injectable } from '@angular/core';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';
import { SuggestMonitorService } from '../suggest-monitor/suggest-monitor.service';
import { FieldTypes, SuggestActions } from '../../constants/suggest';

@Injectable()
export class SuggestHandlerService {
  constructor(private eventBusService: EventBusService, private monitor: SuggestMonitorService) {}

  public handleEvent(
    event: ISuggestionItem | ISuggestionItemList,
    componentsGroupIndex: number,
    source: FieldTypes = undefined,
  ): void {
    // NOTICE: необходимо различать два ивента: клик по ссылке "Есть неактуальные данные?" (передается с доп.атрибутом `isEdit`)
    // и обычный выбор опции из списка саджестов, соответственно, вызывать модалку для удаления неактуальных саджестов или
    // запускать механизм подстановки выбранного значения в инпут.
    if (Object.prototype.hasOwnProperty.call(event, 'isEdit')) {
      this.eventBusService.emit(BusEventType.SuggestionsEditEvent, event as ISuggestionItem);
    } else {
      this.eventBusService.emit(BusEventType.SuggestionSelectedEvent, {
        ...event,
        componentsGroupIndex,
      } as ISuggestionItemList);
    }

    if (source !== undefined) {
      this.monitor.handleAutocompleteEvent(SuggestActions.REUSE_ACTION, source, {
        date: new Date().toISOString(),
      });
    }
  }
}
