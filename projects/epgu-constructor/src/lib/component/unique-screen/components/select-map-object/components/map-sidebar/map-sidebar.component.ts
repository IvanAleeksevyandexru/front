import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DisclaimerDto, KeyValueMap } from '@epgu/epgu-constructor-types';
import {
  BaseComponent,
  UnsubscribeService,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { skip, takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../../../screen/screen.service';
import { MapTypes, SelectMapObjectService } from '../../select-map-object.service';

import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { PanelTypes } from '../search-panel-resolver/search-panel-resolver.component';
import {
  BalloonContentResolverComponent,
  ContentTypes,
} from '../balloon-content-resolver/balloon-content-resolver.component';

@Component({
  selector: 'epgu-constructor-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSidebarComponent extends BaseComponent implements OnInit {
  @ViewChild('balloonComponents') balloonComponents: BalloonContentResolverComponent;
  @Input() sidebarData: SidebarData;
  @Input() previouslyChoosenItem: DictionaryItem;
  @Output() selectObjectEvent = new EventEmitter<YMapItem<DictionaryItem>>();

  public scrollConfig = { suppressScrollX: false, wheelPropagation: false, minScrollbarLength: 32 };
  public searchPanelType: string;
  public balloonContentType: string;
  public balloonDictionaryItems: DictionaryItem[] = [];
  public activeItem: DictionaryItem;
  public originalValue: DictionaryItem[] = [];
  public MapTypes = MapTypes;

  constructor(
    public screenService: ScreenService,
    public selectMapObjectService: SelectMapObjectService,
    private cdr: ChangeDetectorRef,
    private yandexMapService: YandexMapService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {
    super();
  }

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

  public collapseObject(mapObject?: DictionaryItem): void {
    if (mapObject) {
      // eslint-disable-next-line no-param-reassign
      mapObject.expanded = false;
    }
    this.yandexMapService.closeBalloon();
    this.cdr.detectChanges();
  }

  public handleMapObjectClick(mapObject: DictionaryItem): void {
    this.yandexMapService.selectMapObject(mapObject);
  }

  public handlePreviouslyChoosenClick(previouslyChoosen: DictionaryItem): void {
    this.yandexMapService.closeBalloon();
    this.previouslyChoosenItem.expanded = true;
    const { center } = previouslyChoosen;
    this.yandexMapService.setCenter(center as [number, number]);
  }

  private handleSubscriptions(): void {
    this.yandexMapService.selectedValue$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: DictionaryItem[]) => {
        if (this.previouslyChoosenItem) {
          this.previouslyChoosenItem.expanded = false;
        }
        if (value) {
          // ?????? ?????????????????????? ?? ???????????? ?????????????????? ???????????????? ???????????? ???? ????????????,
          // ???????????????????? ?????????????????? ?????????????? ?????????? ?????????????????? ??????????????,
          // ?????? ?????????? ?? ???????? ?????????????????????? ???????????? ?? ?????????????? ?????????? ??????????????
          let activeBalloonRef;
          if (this.activeItem) {
            this.activeItem.expanded = false;
            activeBalloonRef = this.balloonComponents?.findMatchingElementIdx(value[0]);
            if (activeBalloonRef) {
              this.balloonComponents.lockAnimation(true);
            }
          }
          this.originalValue = value;
          [this.activeItem] = value;

          if (value.length === 1 || this.sidebarData.attrs.mapType !== MapTypes.electionsMap) {
            this.activeItem.expanded = true;
          }
          this.cdr.detectChanges();
          // ???? ???????????? ???????? ???????????? ?????????????????????? (???????????????? ?????? ??????????)
          if (this.balloonComponents) {
            this.balloonComponents.detectBalloonChanges();
            const idx = this.balloonComponents.findMatchingElementIdx(value[0]);
            if (idx) {
              window.requestAnimationFrame(() => {
                this.balloonComponents.scrollMatchingRefIntoView(idx);
                if (activeBalloonRef) {
                  this.balloonComponents.lockAnimation(false);
                }
              });
            }
          }
        } else {
          this.originalValue = [];
          this.activeItem = null;
        }
      });

    this.selectMapObjectService.isMapLoaded
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.getBalloonItems();
          this.cdr.detectChanges();
        }
      });

    this.selectMapObjectService.isSelectedView
      .pipe(takeUntil(this.ngUnsubscribe$), skip(1))
      .subscribe(() => {
        this.getBalloonItems();
        this.cdr.detectChanges();
      });
  }

  private getBalloonItems(): void {
    this.balloonDictionaryItems = [];
    const items = this.selectMapObjectService.isSelectedView.getValue()
      ? this.selectMapObjectService.selectedViewItems$.getValue()
      : this.selectMapObjectService.filteredDictionaryItems;
    // ?????????? ?????? ????????????????
    items.forEach((item) => this.balloonDictionaryItems.push(item));
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
  enableFilter?: boolean;
  customNav?: boolean;
  attributeNameWithAddress?: string;
}
