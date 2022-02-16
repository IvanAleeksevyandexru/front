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

type ContentTypesComponents =
  | CommonBalloonContentComponent
  | ElectionsBalloonContentComponent
  | KindergartenContentComponent;

export const ContentTypes = {
  [MapTypes.commonMap]: 'commonContent',
  [MapTypes.electionsMap]: 'electionsContent',
  [MapTypes.kindergartenMap]: 'kindergartenContent',
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
   * Метод раскрывает выбранный зал на панели слева
   * @param mapObject объект на карте
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
