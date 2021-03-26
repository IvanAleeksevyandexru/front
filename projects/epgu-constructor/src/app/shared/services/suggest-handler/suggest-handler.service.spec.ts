import { TestBed } from '@angular/core/testing';
import { SuggestHandlerService } from './suggest-handler.service';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';

describe('SuggestHandlerService', () => {
  let service: SuggestHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestHandlerService,
        EventBusService
      ],
    });
    service = TestBed.inject(SuggestHandlerService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
