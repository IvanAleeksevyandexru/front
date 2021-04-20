import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { debounce, filter, takeUntil, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenModalService } from '../../screen-modal.service';
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
        debounce((component) => timer(component.attrs.displayShowTimeSeconds * this.oneSecond)),
        tap((component: ComponentDto) => {
          this.actionService.switchAction(this.screenService.button, component.id);
        }),
      )
      .subscribe();
  }
}
