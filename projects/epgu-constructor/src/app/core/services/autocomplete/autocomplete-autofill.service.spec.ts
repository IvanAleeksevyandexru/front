import { TestBed } from '@angular/core/testing';

import { AutocompleteAutofillService } from './autocomplete-autofill.service';

describe('AutocompleteAutofillService', () => {
  let service: AutocompleteAutofillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutocompleteAutofillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
