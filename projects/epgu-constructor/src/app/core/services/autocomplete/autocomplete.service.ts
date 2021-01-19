import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import {
  DisplayDto,
  SuggestionsApiResponse,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../screen/screen.service';
import { ConfigService } from '../config/config.service';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';

@Injectable()
export class AutocompleteService {
  componentsSuggestionsMap: Set<{ [key: string]: string }> = new Set();

  constructor(
    private http: HttpClient,
    private screenService: ScreenService,
    private configService: ConfigService,
    private ngUnsubscribe$: UnsubscribeService,
  ) { }

  init(): void {
    this.screenService.display$
      .pipe(
        tap(() => this.resetComponentsSuggestionsSet()),
        filter(display => !!display),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((display: DisplayDto) => {
        const componentsSuggestionsGroupId: string = this.getComponentsSuggestionsGroupId(display);
        const componentsSuggestionsFieldsIds: string[] = this.getComponentsSuggestionsFieldsIds(display);
        if (componentsSuggestionsGroupId) {
          this.getSuggestionsGroup(componentsSuggestionsGroupId)
            .subscribe((suggestions: SuggestionsApiResponse) => {
              console.log({ suggestions });
              // TODO: добавить парсинг, подготовку и проброс данных на уровень компонентов по componentsSuggestionsMap
            });
          return;
        }
        if (componentsSuggestionsFieldsIds.length) {
          this.getSuggestionsFields(componentsSuggestionsFieldsIds)
            .subscribe((suggestions: SuggestionsApiResponse) => {
              console.log({ suggestions });
              // TODO: добавить парсинг, подготовку и проброс данных на уровень компонентов по componentsSuggestionsMap
            });
          return;
        }
      });
  }

  private getSuggestionsGroup(
    groupId: string,
    serviceId: string = '11111',
  ): Observable<SuggestionsApiResponse> {
    const searchQuery = `group=${groupId}&serviceId=${serviceId}`;
    const path = `${this.configService.suggestionsApiUrl}?${searchQuery}`;
    return this.httpGet<SuggestionsApiResponse>(path);
  }

  private getSuggestionsFields(
    fields: Array<string>,
    serviceId: string = '11111',
  ): Observable<SuggestionsApiResponse> {
    const searchQuery = fields
      .map((field) => 'fields=' + field)
      .join('&')
      .concat('&serviceId=' + serviceId);
    const path = `${this.configService.suggestionsApiUrl}?${searchQuery}`;
    return this.httpGet<SuggestionsApiResponse>(path);
  }

  private resetComponentsSuggestionsSet(): void {
    this.componentsSuggestionsMap.clear();
  }

  private getComponentsSuggestionsGroupId(display: DisplayDto): string {
    const groupId = display.suggestion?.groupId;
    this.getComponentsSuggestionsFieldsIds(display);
    this.componentsSuggestionsMap.add({ [groupId]: display.id });
    return groupId;
  }

  private getComponentsSuggestionsFieldsIds(display: DisplayDto): string[] {
    return display.components
      .filter((component) => component.attrs?.suggestionId)
      .map((component) => {
        const suggestionId = component.attrs?.suggestionId;
        this.componentsSuggestionsMap.add({ [suggestionId]: component.id });
        return suggestionId;
      });
  }

  private httpGet<T>(path: string): Observable<T> {
    return this.http.get<T>(path, {
      // withCredentials: true,
    });
  }
}
