import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { KindergartenService, KindergartenStates } from './kindergarten.service';
import { KindergartenSearchPanelService } from '../select-map-object/components/search-panel-resolver/components/kindergarten-search-panel/kindergarten-search-panel.service';

@Component({
  selector: 'epgu-constructor-kindergarten',
  templateUrl: './kindergarten.component.html',
  styleUrls: ['./kindergarten.component.scss'],
  providers: [KindergartenService, KindergartenSearchPanelService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KindergartenComponent implements OnInit {
  public readonly states = KindergartenStates;
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
}
