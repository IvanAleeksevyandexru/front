import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { concatMap, filter, pluck, reduce } from 'rxjs/operators';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { DadataSuggestionsAddress } from '../dictionary/dictionary-api.types';
import { LookupPartialProvider, LookupProvider } from '@epgu/epgu-lib';

export interface DadataSuggestionsAddressForLookup extends DadataSuggestionsAddress {
  id: string;
  text: string;
}

@Injectable()
export class AddressHelperService {
  constructor(private dictionaryApiService: DictionaryApiService) {}

  public getProvider(
    searchType: string = 'city',
    cityFilter?: string[],
  ): LookupProvider | LookupPartialProvider {
    const providers = {
      city: {
        search: (searchString: string): Observable<DadataSuggestionsAddressForLookup[]> => {
          return searchString
            ? this.getSuggestions(searchString, { isCity: 'true' }, cityFilter)
            : of([]);
        },
      },
      region: {
        search: (searchString): Observable<DadataSuggestionsAddressForLookup[]> =>
          searchString
            ? this.getSuggestions(searchString, { isRegion: 'true' }, cityFilter)
            : of([]),
      },
    };

    return providers[searchType];
  }

  /**
   * Получение городов из suggestions дадаты для lib-lookup. Добавляет к suggestions атрибуты id и text
   * @param qString - строка для поиска
   * @param {{ [key: string]: string }} [params={ isCity: 'true' }] - параметры запроса.
   * @param cityFilter - массив для фильтрации
   */
  public getSuggestions(
    qString: string,
    params: { [key: string]: string },
    cityFilter?: string[],
  ): Observable<DadataSuggestionsAddressForLookup[]> {
    return this.dictionaryApiService.getDadataSuggestions(qString, params).pipe(
      pluck('suggestions', 'addresses'),
      concatMap((addresses: DadataSuggestionsAddress[]) => {
        return cityFilter
          ? from(addresses).pipe(
              filter(({ address }: DadataSuggestionsAddress) => {
                const test: string = address.toLowerCase();
                return cityFilter.some(
                  (filter: string) => test.indexOf(filter.toLowerCase()) !== -1,
                );
              }),
            )
          : from(addresses);
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
