import { TestBed } from '@angular/core/testing';

import { SuggestHandlerService } from './suggest-handler.service';
import { SuggestMonitorService } from '../suggest-monitor/suggest-monitor.service';
import { HealthService } from '@epgu/epgu-lib';
import { ScreenService } from '../../../screen/screen.service';
import { EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import {
  ISuggestionItem,
  ISuggestionItemList,
} from '../../../core/services/autocomplete/autocomplete.inteface';

describe('SuggestHandlerService', () => {
  let service: SuggestHandlerService;
  let eventBusService: EventBusService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestHandlerService,
        EventBusService,
        SuggestMonitorService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
      ],
    });
    service = TestBed.inject(SuggestHandlerService);
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
