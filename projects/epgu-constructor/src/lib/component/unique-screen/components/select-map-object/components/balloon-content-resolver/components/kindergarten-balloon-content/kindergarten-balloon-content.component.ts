import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ConfigService,
  IYMapPoint,
  UnsubscribeService,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { IBalloonShowableContent } from '../../../../../../../../shared/services/dictionary/dictionary-api.types';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenContentComponent implements IBalloonContent, OnInit {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader = false;
  @Input() mapObject;
  public selectObject: Function;
  public expandObject: Function;
  public readonly states = KindergartenStates;
  public showAdditionalInfo = false;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public config: ConfigService,
    public kindergartenSearchPanelService: KindergartenSearchPanelService,
    public screenService: ScreenService,
    public kindergartenService: KindergartenService,
    private ngUnsubscribe$: UnsubscribeService,
    private yandexMapService: YandexMapService,
  ) {}

  get address(): string {
    return this.mapObject.baloonContent[0].value;
  }

  get additionalInfo(): IBalloonShowableContent[] {
    return this.mapObject.baloonContent.slice(1);
  }

  public ngOnInit(): void {
    this.screenService.isLoading$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  public calcGartens(mapObj, evt: MouseEvent): void {
    const val =
      this.kindergartenSearchPanelService.deptsLeftToChoose$.value + (mapObj.isSelected ? 1 : -1);
    this.kindergartenSearchPanelService.deptsLeftToChoose$.next(val);
    this.selectObject.apply(null, [mapObj, evt]);
    this.cdr.detectChanges();
  }

  public toggleShowAdditionalInfo(): void {
    this.showAdditionalInfo = !this.showAdditionalInfo;
  }

  public expandAndCenterObject(mapObject: YMapItem<unknown>): void {
    this.expandObject(mapObject);
    if (this.selectMapObjectService.isSelectedView.getValue()) {
      const { center } = mapObject as IYMapPoint<unknown>;
      this.yandexMapService.setCenter(center);
    }
  }
}
