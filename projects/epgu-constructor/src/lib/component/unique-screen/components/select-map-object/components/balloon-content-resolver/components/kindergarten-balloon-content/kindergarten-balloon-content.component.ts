import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ConfigService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenContentComponent implements IBalloonContent, OnInit {
  @Input() isSelectButtonHidden = false;
  @Input() showLoader = false;
  @Input() mapObject;
  public selectObject: Function;
  public expandObject: Function;
  public readonly states = KindergartenStates;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    public cdr: ChangeDetectorRef,
    public config: ConfigService,
    public kindergartenSearchPanelService: KindergartenSearchPanelService,
    public screenService: ScreenService,
    public kindergartenService: KindergartenService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

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
}
