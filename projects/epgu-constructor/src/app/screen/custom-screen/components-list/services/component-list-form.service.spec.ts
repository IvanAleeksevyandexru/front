import { TestBed } from '@angular/core/testing';

import { ComponentListFormService } from './component-list-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { UnsubscribeService } from 'projects/epgu-constructor/src/app/services/unsubscribe/unsubscribe.service';
import { ComponentListToolsService } from './component-list-tools.service';
import { AddressHelperService } from '../address-helper.service';
import { DictionaryApiService } from '../../../services/dictionary-api/dictionary-api.service';
import { HttpClient } from '@angular/common/http';
import { DictionaryApiServiceStub } from 'projects/epgu-constructor/src/app/screen/services/dictionary-api/dictionary-api.service.stub';
import { ComponentListRepositoryService } from './component-list-repository.service';

describe('ComponentListFormService', () => {
  let service: ComponentListFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        ComponentListFormService,
        ValidationService,
        UnsubscribeService,
        ComponentListToolsService,
        AddressHelperService,
        ComponentListRepositoryService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
      ],
    });
    service = TestBed.inject(ComponentListFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
