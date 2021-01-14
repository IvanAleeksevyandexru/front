import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { pluck, concatMap, reduce } from 'rxjs/operators';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import { DadataSuggestionsAddress } from '../../../shared/services/dictionary-api/dictionary-api.types';

export interface DadataSuggestionsAddressForLookup extends DadataSuggestionsAddress {
  id: string;
  text: string;
}

@Injectable()
export class AddressHelperService {
  // Провайдер поиска для передачи в lib-lookup
  // с функцией поиска для lib-lookup. Сам поиск осуществляется за счет suggestions дадаты
  public providers = {
    city: {
      search: (searchString): Observable<DadataSuggestionsAddressForLookup[]> =>
        searchString ? this.getSuggestions(searchString) : of([]),
    },
    region: {
      search: (searchString): Observable<DadataSuggestionsAddressForLookup[]> =>
        searchString ? this.getSuggestions(searchString, { isRegion: 'true' }) : of([]),
    },
  };

  constructor(private dictionaryApiService: DictionaryApiService) {}

  /**
   * Получение городов из suggestions дадаты для lib-lookup. Добавляет к suggestions атрибуты id и text
   * @param qString - строка для поиска
   * @param {{ [key: string]: string }} [params={ isCity: 'true' }] - параметры запроса.
   */
  public getSuggestions(
    qString: string,
    params: { [key: string]: string } = { isCity: 'true' },
  ): Observable<Array<DadataSuggestionsAddressForLookup>> {
    return this.dictionaryApiService.getDadataSuggestions(qString, params).pipe(
      pluck('suggestions', 'addresses'),
      concatMap((addresses: Array<DadataSuggestionsAddress>) => {
        return from(addresses);
      }),
      reduce<DadataSuggestionsAddress, DadataSuggestionsAddressForLookup[]>((acc, value) => {
        acc.push({
          ...value,
          id: value.code,
          text: value.address,
        });
        return acc;
      }, []),
    );
  }

  /**
   * "Наращивает" адресс из suggestions дадаты данными из normalize
   * @param address - объект с адресом из suggestions
   */
  public async normalizeAddress(address: DadataSuggestionsAddressForLookup): Promise<void> {
    let regionCode = null;
    // Если в address объект, значит уже нормализовано
    const isNormalized = typeof address.address === 'object';
    if (isNormalized) {
      return;
    }
    const normalAddress = await this.dictionaryApiService
      .getDadataNormalize(address.address)
      .toPromise();

    if (normalAddress?.address?.elements) {
      const regionKladrId = normalAddress.address.elements.slice(-1)[0].kladrCode;
      regionCode = regionKladrId.toString().substring(0, 2);
    }

    Object.assign(address, normalAddress, { regionCode });
  }
}
