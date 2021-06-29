import { TestBed } from '@angular/core/testing';

import { SuggestHandlerService } from './suggest-handler.service';
import { SuggestMonitorService } from '../suggest-monitor/suggest-monitor.service';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';

describe('SuggestHandlerService', () => {
  let service: SuggestHandlerService;
  let monitor: SuggestMonitorService;
  let eventBusService: EventBusService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [SuggestHandlerService, EventBusService],
    });
    service = TestBed.inject(SuggestHandlerService);
    monitor = TestBed.inject(SuggestMonitorService);
    eventBusService = TestBed.inject(EventBusService);
  });

  describe('handleEvent', () => {
    it('emits suggestionsEditEvent with right params', () => {
      const eventMock: ISuggestionItem = {
        mnemonic: '',
        list: [],
        isEdit: true,
      };
      const eventEmitterSpy = jest.spyOn(eventBusService, 'emit');

      service.handleEvent(eventMock, 1);
      expect(eventEmitterSpy).toBeCalledWith('suggestionsEditEvent', eventMock);
    });

    it('emits suggestionSelectedEvent with right params', () => {
      const eventMock: ISuggestionItemList = {
        value: '',
        mnemonic: '',
        hints: [],
        originalItem: '',
        id: 1,
        componentsGroupIndex: 2,
      };
      const eventEmitterSpy = jest.spyOn(eventBusService, 'emit');

      service.handleEvent(eventMock, 1);
      expect(eventEmitterSpy).toBeCalledWith('suggestionSelectedEvent', {
        ...eventMock,
        componentsGroupIndex: 1,
      });
    });
  });
});
