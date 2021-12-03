import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import {
  ConstructorLookupComponent,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { ListElement, LookupProvider } from '@epgu/ui/models/dropdown';
import { Observable, of } from 'rxjs';
import { DictionaryYMapItem } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryToolsService } from '../../../../../../../../shared/services/dictionary/dictionary-tools.service';
import { SelectMapObjectService } from '../../../../select-map-object.service';

@Component({
  selector: 'epgu-constructor-common-search-panel',
  templateUrl: './common-search-panel.component.html',
  styleUrls: ['./common-search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonSearchPanelComponent implements AfterViewInit {
  @ViewChild('libLookup', { static: false }) libLookup: ConstructorLookupComponent;
  public isNoDepartmentErrorVisible = false;
  public mapIsLoaded = true;
  public handleFiltering: Function;
  public provider: LookupProvider<Partial<ListElement>> = {
    search: this.providerSearch(),
  };

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    private cdr: ChangeDetectorRef,
    private dictionaryToolsService: DictionaryToolsService,
    private yandexMapService: YandexMapService,
  ) {}

  public ngAfterViewInit(): void {
    this.cdr.markForCheck();
  }

  public lookupChanged(
    mapObject: YMapItem<DictionaryYMapItem>,
    lookup: ConstructorLookupComponent,
  ): void {
    this.selectMapObject(mapObject);
    lookup.clearInput();
  }

  private selectMapObject(mapObject: YMapItem<DictionaryYMapItem>): void {
    this.yandexMapService.selectMapObject(mapObject, undefined, false);
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      const filteredItems = this.selectMapObjectService.searchMapObject(searchString);
      this.handleFiltering(filteredItems);
      return of(
        this.dictionaryToolsService.adaptDictionaryToListItem(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }
}
