import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { ConstructorLookupComponent, YandexMapService } from '@epgu/epgu-constructor-ui-kit';
import { LookupProvider, ListElement } from '@epgu/epgu-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import {
  DadataNormalizeResponse,
  DadataSuggestionsAddress,
} from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { SelectMapObjectService } from '../../../../select-map-object.service';

@Component({
  selector: 'epgu-constructor-elections-search-panel',
  templateUrl: './elections-search-panel.component.html',
  styleUrls: ['./elections-search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElectionsSearchPanelComponent implements AfterViewInit {
  @ViewChild('libLookup', { static: false }) libLookup: ConstructorLookupComponent;
  public isNoDepartmentErrorVisible = false;
  public mapIsLoaded = true;

  public provider: LookupProvider<Partial<ListElement>> = {
    search: this.providerSearch(),
  };

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    private cdr: ChangeDetectorRef,
    private dictionaryApiService: DictionaryApiService,
    private yandexMapService: YandexMapService,
  ) {}

  public ngAfterViewInit(): void {
    this.cdr.markForCheck();
  }

  public lookupChanged(dadataSuggestion: DadataSuggestionsAddress): void {
    if (!dadataSuggestion) {
      return;
    }
    this.dictionaryApiService
      .getDadataNormalize(dadataSuggestion.address)
      .subscribe((qwe: DadataNormalizeResponse) => {
        this.yandexMapService.setCenter(
          [+qwe.geo_lon, +qwe.geo_lat],
          Math.max(+qwe.fiasLevel * 2, 8),
        );
      });
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      return this.dictionaryApiService.getDadataSuggestions(searchString).pipe(
        map((response) => {
          return response.suggestions.addresses.map((address) => {
            return { originalItem: address, id: address.address, text: address.address };
          });
        }),
      );
    };
  }
}
