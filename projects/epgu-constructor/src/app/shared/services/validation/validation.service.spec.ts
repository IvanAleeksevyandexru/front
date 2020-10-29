import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import { ComponentListToolsService } from '../../../components-list/services/component-list-tools.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidationService, ComponentListToolsService]
    });
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
