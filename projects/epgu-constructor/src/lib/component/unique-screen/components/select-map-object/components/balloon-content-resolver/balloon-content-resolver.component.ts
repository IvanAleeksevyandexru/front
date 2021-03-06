import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  Type,
  Output,
  EventEmitter,
  ComponentRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { flyInOut, YMapItem, DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { CommonBalloonContentComponent } from './components/common-balloon-content/common-balloon-content.component';
import { ElectionsBalloonContentComponent } from './components/elections-balloon-content/elections-balloon-content.component';
import { DictionaryItem } from '../../../../../../shared/services/dictionary/dictionary-api.types';
import { MapTypes } from '../../select-map-object.service';
import { KindergartenContentComponent } from './components/kindergarten-balloon-content/kindergarten-balloon-content.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ChildrenClubsBalloonContentComponent } from './components/children-clubs-balloon-content/children-clubs-balloon-content.component';
import { arePointsEqual } from '../../select-map-object.helpers';

type ContentTypesComponents =
  | ChildrenClubsBalloonContentComponent
  | CommonBalloonContentComponent
  | ElectionsBalloonContentComponent
  | KindergartenContentComponent;

export const ContentTypes = {
  [MapTypes.commonMap]: 'commonContent',
  [MapTypes.electionsMap]: 'electionsContent',
  [MapTypes.kindergartenMap]: 'kindergartenContent',
  [MapTypes.childrenClubsMap]: 'childrenClubsContent',
  undefined: 'commonContent',
};

@Component({
  selector: 'epgu-constructor-balloon-content-resolver',
  templateUrl: './balloon-content-resolver.component.html',
  styleUrls: ['./balloon-content-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [flyInOut],
})
export class BalloonContentResolverComponent implements AfterViewInit, OnChanges {
  @ViewChild('content', { read: ViewContainerRef }) content: ViewContainerRef;

  @Input() mapObjects;
  @Input() isSelectButtonHidden = false;
  @Input() showChevron = false;
  @Input() contentType = ContentTypes[MapTypes.commonMap];
  @Input() attrs = {};
  @Input() redraw: boolean;
  @Input() showCrossButton = true;
  @Output() selectObject = new EventEmitter<YMapItem<DictionaryItem>>();
  @Output() handleObjectClickEvent = new EventEmitter<YMapItem<DictionaryItem>>();
  @Output() collapseObjectEvent = new EventEmitter<YMapItem<DictionaryItem>>();
  public balloonContentComponentRef: ComponentRef<ContentTypesComponents>;

  private contentMap = {
    [ContentTypes[MapTypes.commonMap]]: CommonBalloonContentComponent,
    [ContentTypes[MapTypes.childrenClubsMap]]: ChildrenClubsBalloonContentComponent,
    [ContentTypes[MapTypes.electionsMap]]: ElectionsBalloonContentComponent,
    [ContentTypes[MapTypes.kindergartenMap]]: KindergartenContentComponent,
    undefined: CommonBalloonContentComponent,
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private screenService: ScreenService,
    public deviceDetector: DeviceDetectorService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mapObjects && changes.mapObjects !== this.mapObjects && this.content) {
      this.balloonContentComponentRef.destroy();
      this.balloonContentComponentRef = null;
      this.addContent();
      this.cdr.detectChanges();
    }
    if ('redraw' in changes && this.balloonContentComponentRef) {
      this.balloonContentComponentRef.instance.cdr.detectChanges();
    }
  }

  public findMatchingElementIdx(item: DictionaryItem): number {
    return this.balloonContentComponentRef.instance.mapObjects.findIndex((object) =>
      arePointsEqual(object, item),
    );
  }

  public detectBalloonChanges(): void {
    this.balloonContentComponentRef.instance.cdr.detectChanges();
  }

  public scrollMatchingRefIntoView(idx: number): void {
    this.balloonContentComponentRef.instance.mapObjects[idx].expanded = true;
    // @ts-ignore
    const matchingElement = this.balloonContentComponentRef.instance.balloonComponents.get(idx);
    matchingElement.nativeElement.scrollIntoView();
  }

  public lockAnimation(value: boolean): void {
    // @ts-ignore
    this.balloonContentComponentRef.instance.lockAnimation = value;
  }

  ngAfterViewInit(): void {
    this.addContent();
    this.cdr.markForCheck();
  }

  public addContent(): void {
    this.balloonContentComponentRef = this.content.createComponent(
      this.getComponent(this.contentType),
    );
    this.setInstanceFields(this.balloonContentComponentRef);

    this.cdr.detectChanges();
  }

  /**
   * ?????????? ???????????????????? ?????????????????? ?????? ???? ???????????? ??????????
   * @param mapObject ???????????? ???? ??????????
   */
  private handleObjectClick(mapObject: YMapItem<DictionaryItem>): void {
    this.handleObjectClickEvent.emit(mapObject);
  }

  private collapseObject(mapObject: YMapItem<DictionaryItem>): void {
    this.collapseObjectEvent.emit(mapObject);
  }

  private getComponent(type: string): Type<ContentTypesComponents> {
    return this.contentMap[type];
  }

  private setInstanceFields(ref): void {
    const { instance } = ref;
    instance.showLoader = this.screenService.isLoading$;
    instance.showChevron = this.showChevron;
    instance.mapObjects = this.mapObjects;
    instance.isSelectButtonHidden = this.isSelectButtonHidden;
    instance.attrs = this.attrs || {};
    instance.showCrossButton = this.showCrossButton;
    instance.selectObject = (obj, evt: Event): void => {
      evt.stopPropagation();
      this.selectObject.emit(obj);
    };
    instance.objectClick = (mapObject): void => this.handleObjectClick(mapObject);
    instance.collapseObject = (mapObject): void => this.collapseObject(mapObject);
  }
}
