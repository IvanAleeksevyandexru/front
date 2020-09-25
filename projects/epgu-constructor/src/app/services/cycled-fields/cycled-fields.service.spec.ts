import { TestBed } from '@angular/core/testing';

import { CycledFieldsService } from './cycled-fields.service';

describe('CycledFieldsService', () => {
  let service: CycledFieldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CycledFieldsService]
    });
    service = TestBed.inject(CycledFieldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
