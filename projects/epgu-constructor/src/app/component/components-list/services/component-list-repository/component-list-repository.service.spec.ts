import { TestBed } from '@angular/core/testing';

import { ComponentListRepositoryService } from './component-list-repository.service';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary-api/dictionary-api.service.stub';
import { ComponentListToolsService } from '../component-list-tools/component-list-tools.service';

describe('ComponentListRepositoryService', () => {
  let service: ComponentListRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ComponentListRepositoryService,
        ComponentListToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
      ],
    });
    service = TestBed.inject(ComponentListRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
