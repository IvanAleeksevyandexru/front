import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService, YandexMapService } from '@epgu/epgu-constructor-ui-kit';
import { KindergartenService, KindergartenStates } from './kindergarten.service';
import { KindergartenSearchPanelService } from '../select-map-object/components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';

@Component({
  selector: 'epgu-constructor-kindergarten',
  templateUrl: './kindergarten.component.html',
  styleUrls: ['./kindergarten.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenComponent implements OnInit, AfterViewInit {
  @ViewChild('selectMapObjectComp', { read: ViewContainerRef })
  selectMapObjectComp: ViewContainerRef;
  public readonly states = KindergartenStates;
  private yandexMapService;
  constructor(
    public kindergartenService: KindergartenService,
    public kindergartenSearchPanel: KindergartenSearchPanelService,
    private cdr: ChangeDetectorRef,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.kindergartenSearchPanel.deptsChoosen$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    this.yandexMapService = this.selectMapObjectComp.injector.get(YandexMapService);
    this.kindergartenService.state$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((state) => {
      if (state === this.states.map) {
        this.yandexMapService.recalcPinStyles();
      }
    });
  }

  public showMap(mapObject): void {
    this.kindergartenService.setState(this.states.map);
    this.yandexMapService.selectMapObject(mapObject, true);
  }
}
