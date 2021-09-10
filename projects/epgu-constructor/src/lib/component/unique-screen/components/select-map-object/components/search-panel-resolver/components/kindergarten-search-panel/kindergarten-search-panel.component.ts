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
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { LookupProvider, ListElement } from '@epgu/epgu-lib';
import { Observable, of } from 'rxjs';
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
  ) {}

  ngOnInit(): void {
    this.kindergartenSearchPanelService.deptsLeftToChoose$.subscribe((value) => {
      this.bottomLabel = `Выбрано ${this.kindergartenSearchPanelService.EDUORGMAX - value} из ${
        this.kindergartenSearchPanelService.EDUORGMAX
      }. Посмотреть`;
      this.cdr.detectChanges();
    });
    this.kindergartenSearchPanelService.getEDUORGMAX().subscribe((response) => {
      this.eduorgmaxHandle(response);
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

  private selectMapObject(mapObject: YMapItem<DictionaryYMapItem>): void {
    this.yandexMapService.selectMapObject(mapObject);
  }

  private providerSearch(): (val: string) => Observable<Partial<ListElement>[]> {
    return (searchString): Observable<Partial<ListElement>[]> => {
      this.selectMapObjectService.searchMapObject(searchString);
      return of(
        this.dictionaryToolsService.adaptDictionaryToListItem(
          this.selectMapObjectService.filteredDictionaryItems,
        ),
      );
    };
  }

  private eduorgmaxHandle(response): void {
    this.kindergartenSearchPanelService.EDUORGMAX = response.items[0].attributeValues
      .EDUORGMAX as number;
    const cacheValue = this.getItemsFromCache();
    this.itemsService.init(this.kindergartenSearchPanelService.EDUORGMAX, cacheValue);
    this.kindergartenSearchPanelService.deptsLeftToChoose$.next(
      this.kindergartenSearchPanelService.EDUORGMAX - cacheValue.length,
    );
    this.topLabel = `<p>Выберите от 1 до ${this.kindergartenSearchPanelService.EDUORGMAX} детских садов</p>`;
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
}
