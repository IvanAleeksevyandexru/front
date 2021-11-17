import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ConstructorLookupModule, YandexMapService } from '@epgu/epgu-constructor-ui-kit';
import { ElectionsSearchPanelComponent } from './elections-search-panel.component';
import {
  DadataSuggestionsResponse,
  DictionaryResponse,
} from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { AddressHelperService } from '../../../../../../../../shared/services/address-helper/address-helper.service';
import { KindergartenSearchPanelService } from '../kindergarten-search-panel/kindergarten-search-panel.service';
import { ForTestsOnlyModule } from '../../../../../../../../core/for-tests-only.module';

describe('ElectionsSearchPanelComponent', () => {
  let addressHelperService: AddressHelperService;
  let dictionaryApiService: DictionaryApiService;
  let kindergartenSearchPanelService: KindergartenSearchPanelService;
  let yandexMapService: YandexMapService;
  let component: ElectionsSearchPanelComponent;
  let fixture: ComponentFixture<ElectionsSearchPanelComponent>;

  const componentMock = { arguments: {}, attrs: {}, id: 'test', type: '1' };

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionsSearchPanelComponent],
      providers: [KindergartenSearchPanelService],
      imports: [HttpClientTestingModule, ForTestsOnlyModule, ConstructorLookupModule],
    });
  });

  beforeEach(() => {
    addressHelperService = TestBed.inject(AddressHelperService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    yandexMapService = TestBed.inject(YandexMapService);
    jest.spyOn(KindergartenSearchPanelService.prototype, 'getEDUORGMAX').mockReturnValue(
      of(({
        items: [
          {
            attributeValues: {
              EDUORGMAX: 2,
            },
          },
        ],
      } as unknown) as DictionaryResponse),
    );
    kindergartenSearchPanelService = TestBed.inject(KindergartenSearchPanelService);
    fixture = TestBed.createComponent(ElectionsSearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('returns adress suggestions in expected format', (done) => {
    const expectedResult = [
      {
        originalItem: {
          code: 'ff3292b1-a1d2-47d4-b35b-ac06b50555cc',
          address: 'г Москва',
          level: 1,
        },
        id: 'г Москва',
        text: 'г Москва',
      },
    ];

    jest
      .spyOn(dictionaryApiService, 'getDadataSuggestions')
      .mockReturnValue(of(mockedApiServiceResponse as DadataSuggestionsResponse));

    component['providerSearch']()('test').subscribe((response) => {
      expect(response).toEqual(expectedResult);
      done();
    });
  });

  it('returns adress suggestions in expected format', () => {
    jest
      .spyOn(dictionaryApiService, 'getDadataNormalize')
      .mockImplementation(() => of({ geo_lon: 1, geo_lat: 2, fiasLevel: 3 } as any));
    const spy = jest.spyOn(yandexMapService, 'setCenter');
    component['lookupChanged']({ address: 'test' } as any);
    expect(spy).toBeCalled();
  });
});
