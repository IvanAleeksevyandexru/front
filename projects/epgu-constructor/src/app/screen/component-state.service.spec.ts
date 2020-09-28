import { TestBed } from '@angular/core/testing';

import { ComponentStateService } from './component-state.service';

describe('ComponentStateService', () => {
  let service: ComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentStateService]
    });
    service = TestBed.inject(ComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
