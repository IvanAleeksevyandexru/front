import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DisclaimerDto, KeyValueMap } from '@epgu/epgu-constructor-types';
import {
  DeviceDetectorService,
  UnsubscribeService,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../../../screen/screen.service';
import { SelectMapObjectService } from '../../select-map-object.service';

import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { PanelTypes } from '../search-panel-resolver/search-panel-resolver.component';
import {
  BalloonContentResolverComponent,
  ContentTypes,
} from '../balloon-content-resolver/balloon-content-resolver.component';
import { arePointsEqual } from '../../select-map-object.helpers';

@Component({
  selector: 'epgu-constructor-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSidebarComponent implements OnInit {
  @ViewChildren('balloonComponents') balloonComponents: QueryList<BalloonContentResolverComponent>;
  @Input() sidebarData: SidebarData;
  @Input() previouslyChoosenItem: DictionaryItem;
  @Output() selectObjectEvent = new EventEmitter<YMapItem<DictionaryItem>>();

  public scrollConfig = { suppressScrollX: false, wheelPropagation: false };
  public searchPanelType: string;
  public balloonContentType: string;
  public balloonDictionaryItems: DictionaryItem[];
  public activeItem: DictionaryItem;

  constructor(
    public screenService: ScreenService,
    public selectMapObjectService: SelectMapObjectService,
    public deviceDetector: DeviceDetectorService,
    private cdr: ChangeDetectorRef,
    private yandexMapService: YandexMapService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.searchPanelType = PanelTypes[this.sidebarData.attrs.mapType];
    this.balloonContentType = ContentTypes[this.sidebarData.attrs.mapType];
    this.handleSubscriptions();
  }

  public handleFiltering(data: DictionaryItem[]): void {
    this.balloonDictionaryItems = data;
    this.cdr.detectChanges();
  }

  public selectObject(value): void {
    this.selectObjectEvent.emit(value);
  }

  public collapseObject(mapObject: DictionaryItem): void {
    // eslint-disable-next-line no-param-reassign
    mapObject.expanded = false;
    if (arePointsEqual(this.previouslyChoosenItem, mapObject)) {
      this.previouslyChoosenItem.expanded = false;
    }
    this.yandexMapService.closeBalloon();
    this.cdr.detectChanges();
  }

  public handleMapObjectClick(mapObject: DictionaryItem): void {
    this.yandexMapService.selectMapObject(mapObject);
  }

  public handlePreviouslyChoosenClick(previouslyChoosen: DictionaryItem): void {
    // eslint-disable-next-line no-param-reassign
    previouslyChoosen.expanded = true;
    this.previouslyChoosenItem.expanded = true;
    const { center } = previouslyChoosen;
    this.yandexMapService.setCenter(center as [number, number]);
  }

  private handleSubscriptions(): void {
    this.yandexMapService.selectedValue$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: DictionaryItem[]) => {
        if (value) {
          [this.activeItem] = value;
          this.activeItem.expanded = true;
          this.expandObject(value[0]);
          this.cdr.detectChanges();
          const matchingBalloon = this.balloonComponents.find((item) =>
            arePointsEqual(item.mapObject, value[0]),
          );
          if (matchingBalloon) {
            matchingBalloon.balloonContentComponentRef.location.nativeElement.scrollIntoView();
          }
        } else {
          this.activeItem = null;
        }
      });

    this.selectMapObjectService.isMapLoaded
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.balloonDictionaryItems = this.getBalloonItems();
          this.cdr.detectChanges();
        }
      });

    this.selectMapObjectService.isSelectedView
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.balloonDictionaryItems = this.getBalloonItems();
        this.cdr.detectChanges();
      });
  }

  private expandObject(mapObject: DictionaryItem): void {
    this.balloonDictionaryItems = this.balloonDictionaryItems.map(
      (object: YMapItem<DictionaryItem>) => {
        const expanded = object === mapObject || arePointsEqual(object, mapObject);
        return { ...object, expanded };
      },
    );
  }

  private getBalloonItems(): DictionaryItem[] {
    return this.selectMapObjectService.isSelectedView.getValue()
      ? this.selectMapObjectService.selectedViewItems$.getValue()
      : this.selectMapObjectService.filteredDictionaryItems;
  }
}

export interface SidebarData {
  label?: string;
  attrs?: SidebarDataAttrs;
}

export interface SidebarDataAttrs {
  disclaimer?: DisclaimerDto;
  noDepartmentsErrorMsg?: string;
  isSelectButtonHidden?: boolean;
  balloonAttrs?: KeyValueMap;
  mapType?: string;
  notFoundItemsMessage?: string;
  isCommonDictionary?: boolean;
}
