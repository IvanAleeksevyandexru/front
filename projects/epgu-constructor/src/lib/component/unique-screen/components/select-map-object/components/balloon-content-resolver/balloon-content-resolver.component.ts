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

type ContentTypesComponents = CommonBalloonContentComponent | ElectionsBalloonContentComponent;

export enum ContentTypes {
  commonContent = 'commonContent',
  electionsContent = 'electionsContent',
}

@Component({
  selector: 'epgu-constructor-balloon-content-resolver',
  templateUrl: './balloon-content-resolver.component.html',
  styleUrls: ['./balloon-content-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalloonContentResolverComponent implements AfterViewInit {
  @ViewChild('content', { read: ViewContainerRef }) content: ViewContainerRef;

  @Input() mapObject;
  @Input() contentType = ContentTypes.commonContent;
  @Output() selectObject = new EventEmitter<unknown>();
  private balloonContentComponentRef: ComponentRef<ContentTypesComponents>;

  private contentMap = {
    [ContentTypes.commonContent]: CommonBalloonContentComponent,
    [ContentTypes.electionsContent]: ElectionsBalloonContentComponent,
  };

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    this.addContent();
    // setTimeout(() => {
    //   this.cdr.markForCheck();
    // }, 0);
    this.cdr.markForCheck();
  }

  public addContent(): void {
    const content = this.componentFactoryResolver.resolveComponentFactory(
      this.getComponent(this.contentType),
    );
    this.balloonContentComponentRef = this.content.createComponent(content);
    const ref = this.balloonContentComponentRef.instance;
    ref.mapObject = this.mapObject;
    ref.selectObject = (obj, evt: Event): void => {
      evt.stopPropagation();
      this.selectObject.emit(obj);
    };
    this.cdr.detectChanges();
  }

  /**
   * Метод раскрывает выбранный зал на панели слева
   * @param mapObject объект на карте
   */
  public expandObject(mapObject: YMapItem<unknown>): void {
    // eslint-disable-next-line no-param-reassign
    mapObject.expanded = !mapObject.expanded;
    this.balloonContentComponentRef.instance.cdr.markForCheck();
  }

  private getComponent(type: ContentTypes): Type<ContentTypesComponents> {
    return this.contentMap[type];
  }
}
