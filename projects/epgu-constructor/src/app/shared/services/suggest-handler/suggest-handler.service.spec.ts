import { TestBed } from '@angular/core/testing';
import { SuggestHandlerService } from './suggest-handler.service';

describe('SuggestHandlerService', () => {
  let service: SuggestHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuggestHandlerService
      ],
    });
    service = TestBed.inject(SuggestHandlerService);
  });

  describe('Check relation type cases', () => {

  });
});
