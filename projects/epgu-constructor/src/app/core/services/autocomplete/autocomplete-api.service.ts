import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../../../core/services/config/config.service';
import { ISuggestionApi } from './autocomplete.inteface';


@Injectable()
export class AutocompleteApiService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {}

  public getSuggestionsGroup(
    groupId: string,
  ): Observable<ISuggestionApi[]> {
    const path = `${this.configService.suggestionsApiUrl}?groups=${groupId}`;
    return this.httpGet<ISuggestionApi[]>(path);
  }

  public getSuggestionsFields(
    fields: Array<string>,
  ): Observable<ISuggestionApi[]> {
    const searchQuery = fields.join(',');
    const path = `${this.configService.suggestionsApiUrl}?fields=${searchQuery}`;
    return this.httpGet<ISuggestionApi[]>(path);
  }

  public deleteSuggestionsField(
    fieldId: number,
  ): Observable<ISuggestionApi[]> {
    const path = `${this.configService.suggestionsApiUrl}?valueGroupId=${fieldId}`;
    return this.httpDelete<ISuggestionApi[]>(path);
  }

  private httpGet<T>(path: string): Observable<T> {
    return this.http.get<T>(path, {
      withCredentials: true,
    });
  }

  private httpDelete<T>(path: string): Observable<T> {
    return this.http.delete<T>(path, {
      withCredentials: true,
    });
  }
}
