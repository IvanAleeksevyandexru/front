import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DadataSuggestions, DadataSuggestionsAddress } from '../../../services/api/dadata-api/dadata-api.types';
import { DictionaryApiService } from '../../../services/api/dictionary-api/dictionary-api.service';

export interface DadataSuggestionsAddressForLookup extends DadataSuggestionsAddress {
  id: string,
  text: string,
}

interface objectWithSuggestions {
  suggestions: DadataSuggestions
}

@Injectable()
export class AddressHelperService {

  constructor(private dictionaryApiService: DictionaryApiService) { }

  // Провайдер поиска для передачи в lib-lookup
  // с функцией поиска для lib-lookup. Сам поиск осуществляется за счет suggestions дадаты
  public provider = { search: (searchString) => searchString ? this.getCitySuggestions(searchString) : of([]) };

  /**
   * Получение городов из suggestions дадаты для lib-lookup. Добавляет к suggestions атрибуты id и text
   * @param qString - строка для поиска
   */
  public getCitySuggestions(qString: string): Observable<Array<DadataSuggestionsAddressForLookup>> {
    return this.dictionaryApiService.getDadataSuggestions(qString, { isCity: 'true' })
      .pipe(
        map(({ suggestions }: objectWithSuggestions) => {
          return suggestions.addresses
            .map((address) => {
              return {
                ...address,
                id: address.code,
                text: address.address,
              };
            });
        }),
      );
  }

  /**
   * "Наращивает" адресс из suggestions дадаты данными из normalize
   * @param address - объект с адресом из suggestions
   */
  public async normalizeAddress(address: DadataSuggestionsAddressForLookup) {
    const normalAddress = await this.dictionaryApiService.getDadataNormalize(address.address).toPromise();
    Object.assign(address, normalAddress);
  }
}
