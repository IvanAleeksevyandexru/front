import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ConstructorLookupComponent,
  KINDERGATEN_MAX_VALUE,
  UnsubscribeService,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { LookupProvider, ListElement } from '@epgu/epgu-lib';
import { Observable, of } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { JsonHelperService } from '../../../../../../../../core/services/json-helper/json-helper.service';
import { ModalErrorService } from '../../../../../../../../modal/modal-error.service';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { DictionaryYMapItem } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
import { DictionaryToolsService } from '../../../../../../../../shared/services/dictionary/dictionary-tools.service';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { PriorityItemsService } from '../../../../services/priority-items/priority-items.service';
import { KindergartenSearchPanelService } from './kindergarten-search-panel.service';

@Component({
  selector: 'epgu-constructor-kindergarten-search-panel',
  templateUrl: './kindergarten-search-panel.component.html',
  styleUrls: ['./kindergarten-search-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenSearchPanelComponent implements AfterViewInit, OnInit {
  @ViewChild('libLookup', { static: false }) libLookup: ConstructorLookupComponent;
  public isNoDepartmentErrorVisible = false;
  public mapIsLoaded = true;
  public topLabel: string;
  public bottomLabel: string;

  public provider: LookupProvider<Partial<ListElement>> = {
    search: this.providerSearch(),
  };

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public kindergartenSearchPanelService: KindergartenSearchPanelService,
    private cdr: ChangeDetectorRef,
    private dictionaryToolsService: DictionaryToolsService,
    private yandexMapService: YandexMapService,
    private modalErrorService: ModalErrorService,
    private itemsService: PriorityItemsService,
    private screenService: ScreenService,
    private jsonHelperService: JsonHelperService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.kindergartenSearchPanelService.deptsLeftToChoose$.subscribe((value) => {
      this.bottomLabel = `Выбрано ${this.kindergartenSearchPanelService.EDUORGMAX - value} из ${
        this.kindergartenSearchPanelService.EDUORGMAX
      }.`;
      this.cdr.detectChanges();
    });
    this.kindergartenSearchPanelService.getEDUORGMAX().subscribe((response) => {
      this.eduorgmaxHandle(response);
    });
    this.selectMapObjectService.isMapLoaded
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter((val) => !!val),
      )
      .subscribe(() => {
        this.placeChildsHomeOnMap();
      });
  }

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

  public toggleSelectedKindergartensView(): void {
    if (this.selectMapObjectService.isSelectedView.getValue()) {
      this.selectMapObjectService.resetSelectedView();
      this.selectMapObjectService.placeChildsHomeOnMap();
    } else {
      this.selectMapObjectService.handleKindergartenSelection();
    }
  }

  private selectMapObject(mapObject: YMapItem<DictionaryYMapItem>): void {
    if (mapObject) {
      const objectCoords = mapObject.center;
      const { childHomeCoords } = this.kindergartenSearchPanelService;
      const bounds = this.yandexMapService.getBoundsByCoords([objectCoords, childHomeCoords]);
      this.yandexMapService.setBounds(bounds);
      const feature = this.yandexMapService.getObjectById(mapObject.objectId);
      if (feature) {
        this.yandexMapService.handleFeatureSelection(feature);
      }
    }
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      this.selectMapObjectService.searchMapObject(searchString);
      this.placeChildsHomeOnMap();
      return of(
        this.dictionaryToolsService.adaptDictionaryToListItem(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }

  private eduorgmaxHandle(response): void {
    const responseValue = response.items[0].attributeValues.EDUORGMAX as number;
    this.kindergartenSearchPanelService.EDUORGMAX = Math.min(responseValue, KINDERGATEN_MAX_VALUE);
    const cacheValue = this.getItemsFromCache();
    this.itemsService.init(this.kindergartenSearchPanelService.EDUORGMAX, cacheValue);
    this.kindergartenSearchPanelService.deptsLeftToChoose$.next(
      this.kindergartenSearchPanelService.EDUORGMAX - cacheValue.length,
    );
    this.topLabel =
      this.kindergartenSearchPanelService.EDUORGMAX === 1
        ? `<p>Выберите детский сад</p>`
        : `<p>Выберите от 1 до ${this.kindergartenSearchPanelService.EDUORGMAX} детских садов</p>`;
    if (response.items.length !== 1) {
      this.modalErrorService.showError('Не удалось определить EDUORGMAX');
    }
    this.cdr.detectChanges();
  }

  private getItemsFromCache(): DictionaryYMapItem[] {
    const valueFromCache = this.jsonHelperService.tryToParse(
      this.screenService.getCompValueFromCachedAnswers(),
    ) as {
      items: DictionaryYMapItem[];
    };
    return valueFromCache?.items || [];
  }

  private placeChildsHomeOnMap(): void {
    this.selectMapObjectService.placeChildsHomeOnMap();
  }
}
