import { TestBed } from '@angular/core/testing';

import { ComponentListToolsService } from './component-list-tools.service';

describe('ComponentListToolsService', () => {
  let service: ComponentListToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentListToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
