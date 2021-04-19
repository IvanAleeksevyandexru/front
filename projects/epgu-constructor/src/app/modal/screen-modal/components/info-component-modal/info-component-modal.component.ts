import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenModalService } from '../../screen-modal.service';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Component({
  selector: 'epgu-constructor-info-component-modal',
  templateUrl: './info-component-modal.component.html',
  styleUrls: ['./info-component-modal.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponentModalComponent implements OnInit {
  private oneSecond = 1000;

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private actionService: ActionService,
    public screenService: ScreenService,
    public screenModalService: ScreenModalService,
    private utils: UtilsService,
  ) {}

  ngOnInit(): void {
    this.screenService.component$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter((component: ComponentDto) =>
          this.utils.isDefined(component.attrs?.displayShowTimeSeconds),
        ),
        tap((component: ComponentDto) => {
          setTimeout(
            () => this.actionService.switchAction(this.screenService.button, component.id),
            component.attrs.displayShowTimeSeconds * this.oneSecond,
          );
        }),
      )
      .subscribe();
  }
}
