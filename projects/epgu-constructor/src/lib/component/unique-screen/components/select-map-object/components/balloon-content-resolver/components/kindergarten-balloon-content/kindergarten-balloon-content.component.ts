import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ConfigService,
  DeviceDetectorService,
  flyInOut,
  IYMapPoint,
  UnsubscribeService,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import {
  KindergartenService,
  KindergartenStates,
} from '../../../../../kindergarten/kindergarten.service';
import { SelectMapObjectService } from '../../../../select-map-object.service';
import { KindergartenSearchPanelService } from '../../../search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';
import { IBalloonContent } from '../../balloon-content-resolver.interface';

@Component({
  selector: 'epgu-constructor-kindergarten-balloon-content',
  templateUrl: './kindergarten-balloon-content.component.html',
  styleUrls: ['./kindergarten-balloon-content.component.scss'],
  providers: [UnsubscribeService],
  animations: [flyInOut],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenContentComponent implements IBalloonContent, OnInit {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader: Observable<false>;
  @Input() mapObjects;
  @Input() showCrossButton = true;

  public selectObject: Function;
  public objectClick: Function;
  public collapseObject: Function;
  public readonly states = KindergartenStates;
  public showAdditionalInfo = false;
  public additionalFields;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public config: ConfigService,
    public kindergartenSearchPanelService: KindergartenSearchPanelService,
    public screenService: ScreenService,
    public kindergartenService: KindergartenService,
    public deviceDetector: DeviceDetectorService,
    private ngUnsubscribe$: UnsubscribeService,
    private yandexMapService: YandexMapService,
  ) {}

  public ngOnInit(): void {
    this.fillAdditionalFields();
    this.screenService.isLoading$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      window.requestAnimationFrame(() => this.cdr.detectChanges());
    });
  }

  public calcGartens(mapObj, evt: MouseEvent): void {
    this.selectObject(mapObj, evt);
    this.cdr.detectChanges();
  }

  public toggleShowAdditionalInfo(): void {
    this.showAdditionalInfo = !this.showAdditionalInfo;
  }

  // TODO разобраться почему метод вызывает срабатывание ngOnInit и обрезаение mapObjects до 1 элемента
  public expandAndCenterObject(mapObject: YMapItem<unknown>): void {
    this.objectClick(mapObject);
    if (this.selectMapObjectService.isSelectedView.getValue()) {
      const { center } = mapObject as IYMapPoint<unknown>;
      this.yandexMapService.setCenter(center);
    }
  }

  private fillAdditionalFields(): void {
    this.additionalFields = {};
    this.mapObjects.forEach((mapObject) => {
      this.additionalFields[mapObject.value] = {
        address: mapObject.baloonContent[0].value,
        additionalInfo: mapObject.baloonContent.slice(1),
      };
    });
  }
}
