import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { delay, filter, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ActionService } from '../../../../shared/directives/action/action.service';

@Component({
  selector: 'epgu-constructor-info-component-modal',
  templateUrl: './info-component-modal.component.html',
  styleUrls: ['./info-component-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponentModalComponent implements OnInit {
  delayBeforeAutoClick = 1500;

  constructor(
    public screenService: ScreenService,
    public screenModalService: ScreenModalService,
    private ngUnsubscribe$: UnsubscribeService,
    public actionService: ActionService,
  ) {}

  ngOnInit(): void {
    this.screenService.component$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter((component: ComponentDto) => !!component?.attrs?.isNeedAutoClick),
        delay(this.delayBeforeAutoClick),
        tap((component: ComponentDto) => {
          this.actionService.switchAction(this.screenService.button, component.id);
        }),
      )
      .subscribe();
  }
}
