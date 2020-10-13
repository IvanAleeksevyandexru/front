import { TestBed } from '@angular/core/testing';

import { ComponentListRepositoryService } from './component-list-repository.service';

describe('ComponentListRepositoryService', () => {
  let service: ComponentListRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentListRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
