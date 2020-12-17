import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { filter, pluck, concatMap, reduce } from 'rxjs/operators';
import { DictionaryApiService } from '../../../shared/services/dictionary-api/dictionary-api.service';
import {
  DadataSuggestions,
  DadataSuggestionsAddress,
} from '../../../shared/services/dictionary-api/dictionary-api.types';

export interface DadataSuggestionsAddressForLookup extends DadataSuggestionsAddress {
  id: string;
  text: string;
}

interface objectWithSuggestions {
  suggestions: DadataSuggestions;
}

@Injectable()
export class AddressHelperService {
  // Провайдер поиска для передачи в lib-lookup
  // с функцией поиска для lib-lookup. Сам поиск осуществляется за счет suggestions дадаты
  public provider = {
    search: (searchString): Observable<DadataSuggestionsAddressForLookup[]> =>
      searchString ? this.getCitySuggestions(searchString) : of([]),
  };

  constructor(private dictionaryApiService: DictionaryApiService) {}

  /**
   * Получение городов из suggestions дадаты для lib-lookup. Добавляет к suggestions атрибуты id и text
   * @param qString - строка для поиска
   */
  public getCitySuggestions(qString: string): Observable<Array<DadataSuggestionsAddressForLookup>> {
    return this.dictionaryApiService.getDadataSuggestions(qString, { isCity: 'true' }).pipe(
      pluck('suggestions', 'addresses'),
      concatMap((addresses: Array<DadataSuggestionsAddress>) => {
        return from(addresses);
      }),
      //TODO: Временное ограничение для EPGUCORE-43916
      filter(({ address }: DadataSuggestionsAddress) => {
        const test: string = address.toLowerCase();
        return test.indexOf('москва') !== -1 || test.indexOf('московская обл') !== -1;
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
