import { Injectable } from '@angular/core';
import { ISuggestionItem, ISuggestionItemList } from '../../../core/services/autocomplete/autocomplete.inteface';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

@Injectable()
export class SuggestHandlerService {

  constructor (private eventBusService: EventBusService) {}

  public handleEvent(event: ISuggestionItem | ISuggestionItemList, componentsGroupIndex: number): void {
    // NOTICE: необходимо различать два ивента: клик по ссылке "Есть неактуальные данные?" (передается с доп.атрибутом `isEdit`)
    // и обычный выбор опции из списка саджестов, соответственно, вызывать модалку для удаления неактуальных саджестов или
    // запускать механизм подстановки выбранного значения в инпут.
    if (Object.prototype.hasOwnProperty.call(event, 'isEdit')) {
      this.eventBusService.emit('suggestionsEditEvent', event as ISuggestionItem);
    } else {
      this.eventBusService.emit('suggestionSelectedEvent', {
        ...event,
        componentsGroupIndex,
      } as ISuggestionItemList);
    }
  }

}
