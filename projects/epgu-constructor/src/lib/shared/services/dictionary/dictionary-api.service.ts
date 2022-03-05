import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, delayWhen, filter, finalize, map, tap } from 'rxjs/operators';
import {
  DictionaryOptions,
  AdditionalRequestParam,
  DictionaryUrlTypes,
  KeyValueMap,
} from '@epgu/epgu-constructor-types';
import {
  DadataNormalizeResponse,
  DadataSuggestionsResponse,
  DictionaryResponse,
} from './dictionary-api.types';
import {
  DIRECTIONS_SUB_URL,
  MUNICIPALITIES_SUB_URL,
  PROGRAM_DETAIL_SUB_URL,
  SEARCH_GROUP_SUB_URL,
  SEARCH_PROGRAM_SUB_URL,
} from '../../../component/unique-screen/components/children-clubs/services/health/health-handler';
import {
  FindOptionsProgram,
  BaseProgram,
  FindResponseProgram,
  Program,
  FindOptionsGroup,
  Group,
  FindResponseGroup,
  FocusDirectionsItem,
  DirectionsResponse,
  Municipality,
  MunicipalityResponse,
} from '../../../component/unique-screen/components/children-clubs/models/children-clubs.types';

@Injectable()
export class DictionaryApiService {
  private dictionaryUrlMap = {
    [DictionaryUrlTypes.dictionary]: (): string => this.config.dictionaryUrl,
    [DictionaryUrlTypes.nsiSuggest]: (): string => this.config.nsiSuggestDictionaryUrl,
    [DictionaryUrlTypes.lkApi]: (): string => this.config.lkApi,
    [DictionaryUrlTypes.childrenClubsApi]: (): string => this.config.childrenClubsApi,
    [DictionaryUrlTypes.schoolDictionaryUrl]: (): string => this.config.schoolDictionaryUrl,
    [DictionaryUrlTypes.schoolSearchUrl]: (): string => this.config.schoolSearchUrl,
    undefined: (): string => this.config.dictionaryUrl,
  };

  private dictionaryCache: Record<string, DictionaryResponse> = {};

  private processStatus: BehaviorSubject<Record<string, true>> = new BehaviorSubject<
    Record<string, true>
  >({});

  constructor(private http: HttpClient, private config: ConfigService) {}

  /**
   * Возвращает данные справочника
   * @param dictionaryName - название справочника
   * @param options - опции для получения данных
   */
  public getGenericDictionary(
    dictionaryName: string,
    options: DictionaryOptions = {},
    dictionaryUrlType: DictionaryUrlTypes = DictionaryUrlTypes.dictionary,
  ): Observable<DictionaryResponse> {
    const path = `${this.dictionaryUrlMap[dictionaryUrlType]()}/${dictionaryName}`;
    const cacheId = dictionaryName + JSON.stringify(options);

    // TODO: Вынести кеш логику в кеш сервис
    return of(cacheId).pipe(
      delayWhen(() => this.processStatus.pipe(filter((v) => !v[cacheId]))),
      concatMap((id) => {
        if (this.dictionaryCache[id]) {
          return of(this.dictionaryCache[id]);
        }
        const status = this.processStatus.getValue();
        status[id] = true;
        this.processStatus.next(status);

        return this.post<DictionaryResponse>(path, options).pipe(
          tap((response) => {
            if (!this.hasDictionaryResponseError(response)) {
              this.dictionaryCache[id] = response;
            }
          }),
          finalize(() => {
            const processStatusValue = this.processStatus.getValue();
            delete processStatusValue[id];
            this.processStatus.next(processStatusValue);
          }),
        );
      }),
    );
  }

  public getMvdDictionary(
    dictionaryName: string,
    options: DictionaryOptions = {},
  ): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('mvd')
      ? `${this.config.mockUrl}/nsi/v1/dictionary`
      : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;
    return this.post<DictionaryResponse>(path, options);
  }

  public getSelectMapDictionary(
    dictionaryName: string,
    options: DictionaryOptions = {},
  ): Observable<DictionaryResponse> {
    const urlPrefix = this.config.mocks.includes('selectMap')
      ? `${this.config.mockUrl}/nsi/v1/dictionary`
      : this.config.dictionaryUrl;
    const path = `${urlPrefix}/${dictionaryName}`;

    return this.post<DictionaryResponse>(path, options);
  }

  public getDadataSuggestions(
    qString: string,
    params?: KeyValueMap,
  ): Observable<DadataSuggestionsResponse> {
    const path = `${this.config.externalApiUrl}/dadata/suggestions`;
    return this.get<DadataSuggestionsResponse>(path, {
      params: {
        q: qString,
        ...params,
      },
    });
  }

  public getDadataNormalize(qString: string): Observable<DadataNormalizeResponse> {
    const path = `${this.config.externalApiUrl}/dadata/normalize`;
    return this.get<DadataNormalizeResponse>(path, {
      params: {
        q: qString,
      },
    });
  }

  public getProgramList(options: FindOptionsProgram): Observable<BaseProgram[]> {
    const useOptionsAsPayload = true;
    return this.post<FindResponseProgram>(
      `${this.config.childrenClubsApi}${SEARCH_PROGRAM_SUB_URL}`,
      options,
      useOptionsAsPayload,
    ).pipe(map((result) => result?.items ?? []));
  }

  public getProgram(uuid: string, nextSchoolYear: boolean): Observable<Program> {
    const params = new HttpParams().append('nextSchoolYear', String(nextSchoolYear));

    return this.get<Program>(`${this.config.childrenClubsApi}${PROGRAM_DETAIL_SUB_URL}${uuid}`, {
      params,
    });
  }

  public getGroupList(uuid: string, options: FindOptionsGroup): Observable<Group[]> {
    const useOptionsAsPayload = true;
    return this.post<FindResponseGroup>(
      `${this.config.childrenClubsApi}${PROGRAM_DETAIL_SUB_URL}${uuid}${SEARCH_GROUP_SUB_URL}`,
      options,
      useOptionsAsPayload,
    ).pipe(map((result) => result?.items ?? []));
  }

  public getDirections(okato: string): Observable<FocusDirectionsItem[]> {
    const params = new HttpParams().append('okato', okato);

    return this.get<DirectionsResponse>(`${this.config.childrenClubsApi}${DIRECTIONS_SUB_URL}`, {
      params,
    }).pipe(map((result) => result?.items ?? []));
  }

  public getMunicipalities(okato: string): Observable<Municipality[]> {
    const params = new HttpParams().append('okato', okato);

    return this.get<MunicipalityResponse>(
      `${this.config.childrenClubsApi}${MUNICIPALITIES_SUB_URL}`,
      {
        params,
      },
    ).pipe(map((result) => result?.items ?? []));
  }

  private hasDictionaryResponseError(response: DictionaryResponse): boolean {
    const { error } = response;
    if (!error) {
      return false;
    }
    const codeCheck = error.code && error.code !== 0;
    const errorCodeCheck = error.errorCode && error.code !== 0;
    const errorDetailMessageCheck =
      error.errorDetail?.errorMessage &&
      error.errorDetail.errorMessage.toLowerCase() !== 'operation completed';
    return !!(codeCheck || errorCodeCheck || errorDetailMessageCheck);
  }

  private post<T>(
    path: string,
    options: DictionaryOptions | FindOptionsGroup,
    useOptionsAsPayload?: boolean,
  ): Observable<T> {
    if (useOptionsAsPayload) {
      return this.http.post<T>(path, options, {
        withCredentials: true,
      });
    }

    const dictOptions = options as DictionaryOptions;
    const excludedParams = dictOptions?.excludedParams;
    const additionalParams = dictOptions?.additionalParams;
    const payload = {
      filter: dictOptions.filter,
      treeFiltering: dictOptions.treeFiltering || 'ONELEVEL',
      pageNum: dictOptions.pageNum || 1,
      pageSize: dictOptions.pageSize || '10000',
      parentRefItemValue: dictOptions.parentRefItemValue || '',
      selectAttributes: dictOptions.selectAttributes || ['*'],
      tx: dictOptions.tx || '',
    } as DictionaryOptions;

    if (dictOptions?.filterCodes) {
      payload.filterCodes = dictOptions.filterCodes;
    }

    if (excludedParams && Array.isArray(excludedParams)) {
      excludedParams.forEach((param: string) => {
        delete payload[param];
      });
    }

    if (additionalParams && Array.isArray(additionalParams)) {
      additionalParams.forEach((param: AdditionalRequestParam) => {
        payload[param.name] = param.value;
      });
    }

    return this.http.post<T>(path, payload, {
      withCredentials: true,
    });
  }

  private get<T>(path: string, options: object): Observable<T> {
    const newOptions = { ...options, withCredentials: true };
    return this.http.get<T>(path, newOptions);
  }
}
