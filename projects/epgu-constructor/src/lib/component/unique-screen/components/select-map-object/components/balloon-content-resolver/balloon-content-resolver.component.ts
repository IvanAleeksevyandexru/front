import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
  Type,
  Output,
  EventEmitter,
  ComponentRef,
} from '@angular/core';
import { YMapItem } from '@epgu/epgu-constructor-ui-kit';
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
})
export class BalloonContentResolverComponent implements AfterViewInit {
  @ViewChild('content', { read: ViewContainerRef }) content: ViewContainerRef;

  @Input() mapObject;
  @Input() isSelectButtonHidden = false;
  @Input() contentType = ContentTypes[MapTypes.commonMap];
  @Input() attrs;
  @Output() selectObject = new EventEmitter<YMapItem<DictionaryItem>>();
  @Output() expandObjectEvent = new EventEmitter<YMapItem<DictionaryItem>>();
  private balloonContentComponentRef: ComponentRef<ContentTypesComponents>;

  private contentMap = {
    [ContentTypes[MapTypes.commonMap]]: CommonBalloonContentComponent,
    [ContentTypes[MapTypes.electionsMap]]: ElectionsBalloonContentComponent,
    [ContentTypes[MapTypes.kindergartenMap]]: KindergartenContentComponent,
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private screenService: ScreenService,
  ) {}

  ngAfterViewInit(): void {
    this.addContent();
    this.cdr.markForCheck();
  }

  public addContent(): void {
    const content = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponent(this.contentType),
    );
    this.balloonContentComponentRef = this.content.createComponent(content);
    this.setInstanceFields(this.balloonContentComponentRef);

    this.cdr.detectChanges();
  }

  /**
   * Метод раскрывает выбранный зал на панели слева
   * @param mapObject объект на карте
   */
  private expandObject(mapObject: YMapItem<DictionaryItem>): void {
    this.expandObjectEvent.emit(mapObject);
  }

  private getComponent(type: string): Type<ContentTypesComponents> {
    return this.contentMap[type];
  }

  private setInstanceFields(ref): void {
    const { instance } = ref;
    instance.showLoader = this.screenService.isLoading$;
    instance.mapObject = this.mapObject;
    instance.isSelectButtonHidden = this.isSelectButtonHidden;
    instance.attrs = this.attrs;
    instance.selectObject = (obj, evt: Event): void => {
      evt.stopPropagation();
      this.selectObject.emit(obj);
    };
    instance.expandObject = (mapObject): void => this.expandObject(mapObject);
  }
}
