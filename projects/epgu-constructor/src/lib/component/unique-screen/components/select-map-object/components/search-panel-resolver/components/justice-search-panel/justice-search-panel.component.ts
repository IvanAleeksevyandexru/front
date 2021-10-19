import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ConstructorLookupComponent,
  UnsubscribeService,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';
import { ListElement, LookupProvider } from '@epgu/ui/models/dropdown';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import {
  DadataNormalizeResponse,
  DadataSuggestionsAddress,
} from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { JusticeSearchPanelService } from './justice-search-panel.service';

@Component({
  selector: 'epgu-constructor-justice-search-panel',
  templateUrl: './justice-search-panel.component.html',
  styleUrls: ['./justice-search-panel.component.scss'],
  providers: [UnsubscribeService, JusticeSearchPanelService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JusticeSearchPanelComponent implements AfterViewInit {
  @ViewChild('libLookup', { static: false }) libLookup: ConstructorLookupComponent;
  public isNoDepartmentErrorVisible = false;
  public mapIsLoaded = true;
  public provider: LookupProvider<Partial<ListElement>> = {
    search: this.providerSearch(),
  };
  public searchControl = new FormControl('');
  public data: ComponentDto;

  constructor(
    private screenService: ScreenService,
    private dictionaryApiService: DictionaryApiService,
    private yandexMapService: YandexMapService,
    private yaMapService: YaMapService,
    private ngUnsubscribe$: UnsubscribeService,
    private justiceSearchPanelService: JusticeSearchPanelService,
  ) {
    this.data = this.screenService.getCompFromDisplay().attrs.searchPanel || ({} as ComponentDto);
  }

  public ngAfterViewInit(): void {
    this.screenService.isLoaderVisible.next(false);
    this.justiceSearchPanelService.fullAddress.subscribe((e) => {
      this.searchControl.setValue({
        originalItem: {
          address: e,
        },
        id: e,
        text: e,
      });
    });

    this.yaMapService.mapSubject
      .pipe(
        filter((yMap) => yMap),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.yandexMapService.placeObjectsOnMap([]);
        this.justiceSearchPanelService.initPolygons();
      });
  }

  public lookupChanged(dadataSuggestion: DadataSuggestionsAddress): void {
    if (!dadataSuggestion) {
      return;
    }
    this.dictionaryApiService
      .getDadataNormalize(dadataSuggestion.address)
      .subscribe((response: DadataNormalizeResponse) => {
        if (response.geo_lon && response.geo_lat) {
          const defaultMapZoomRate = 8;
          const fiasZoomMultiplier = 2;
          this.yandexMapService.setCenter(
            [+response.geo_lon, +response.geo_lat],
            Math.max(+response.fiasLevel * fiasZoomMultiplier, defaultMapZoomRate),
          );
          this.justiceSearchPanelService.mapClick([+response.geo_lon, +response.geo_lat]);
        }
      });
  }

  // TODO отрефакторить дублируемый код
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
