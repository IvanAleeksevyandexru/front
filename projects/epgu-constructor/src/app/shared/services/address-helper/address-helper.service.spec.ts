import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { ConfigServiceStub } from '../../../core/services/config/config.service.stub';
import { ConfigService } from '../../../core/services/config/config.service';
import { AddressHelperService, DadataSuggestionsAddressForLookup } from './address-helper.service';
import { DadataSuggestionsResponse } from '../dictionary/dictionary-api.types';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';

describe('AddressHelperService', () => {
  let service: AddressHelperService;
  let dictionaryApiService: DictionaryApiService;

  const address: DadataSuggestionsAddressForLookup = {
    address: 'г Москва',
    code: 'ff3292b1-a1d2-47d4-b35b-ac06b50555cc',
    id: 'ff3292b1-a1d2-47d4-b35b-ac06b50555cc',
    level: 1,
    text: 'г Москва',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        AddressHelperService,
        DictionaryApiService,
        HttpClientTestingModule,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AddressHelperService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
  });

  describe('getSuggestions method', () => {
    it('returns adress suggestions in expected format', () => {
      const mockedApiServiceResponse: Partial<DadataSuggestionsResponse> = {
        suggestions: {
          error: {
            code: 0,
            message: 'operation completed',
          },
          addresses: [
            {
              code: 'ff3292b1-a1d2-47d4-b35b-ac06b50555cc',
              address: 'г Москва',
              level: 1,
            },
          ],
        },
      };
      const expectedResult = [address];

      jest
        .spyOn(dictionaryApiService, 'getDadataSuggestions')
        .mockReturnValue(of(mockedApiServiceResponse as DadataSuggestionsResponse));
      service.getSuggestions('Москва', { isCity: 'true' }).subscribe((response) => {
        expect(response).toEqual(expectedResult);
      });
    });
  });

  describe('normalizeAddress method', () => {
    beforeEach(() => {
      spyOn(
        dictionaryApiService,
        'getDadataNormalize',
      ).and.callFake((address: DadataSuggestionsAddressForLookup) => of());
    });

    it('calls getDadataNormalize if address is not normalized', () => {
      service.normalizeAddress(address);
      expect(dictionaryApiService.getDadataNormalize).toHaveBeenCalled();
    });

    it('does not call getDadataNormalize if address is normalized', () => {
      const normalizedAddress = { ...address, address: {}};
      service.normalizeAddress(normalizedAddress as DadataSuggestionsAddressForLookup);
      expect(dictionaryApiService.getDadataNormalize).not.toHaveBeenCalled();
    });
  });
});