import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ScreenService } from '../../../../screen/screen.service';
import {
  ComponentDto,
  ComponentDtoAction,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { CycledFieldsService } from '../../../../screen/services/cycled-fields/cycled-fields.service';
import { NavigationPayload } from '../../../../form-player/form-player.types';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { ScreenModalService } from '../../screen-modal.service';

@Component({
  selector: 'epgu-constructor-info-component-modal',
  templateUrl: './info-component-modal.component.html',
  styleUrls: ['./info-component-modal.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoComponentModalComponent implements OnInit {
  actionButtons: ComponentDtoAction[] = [];

  constructor(
    private navModalService: NavigationModalService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    public screenModalService: ScreenModalService,
    private cycledFieldsService: CycledFieldsService,
  ) {}

  ngOnInit(): void {
    this.screenService.currentCycledFields$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.cycledFieldsService.initCycledFields(this.screenService.currentCycledFields);
    });

    this.screenService.component$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((component) => this.setActionButtons(component));
  }

  setActionButtons(component: ComponentDto) {
    this.actionButtons = component?.attrs?.actions || [];
  }

  prevStep(): void {
    this.navModalService.prev({});
  }

  nextStep(): void {
    const navigation = { payload: this.getComponentState() };
    this.navModalService.next(navigation);
  }

  getComponentState(): NavigationPayload {
    return this.cycledFieldsService.dataTransform();
  }
}
