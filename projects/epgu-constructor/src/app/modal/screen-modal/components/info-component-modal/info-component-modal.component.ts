import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import {
  ComponentDto,
  ComponentActionDto,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenModalService } from '../../screen-modal.service';

@Component({
  selector: 'epgu-constructor-info-component-modal',
  templateUrl: './info-component-modal.component.html',
  styleUrls: ['./info-component-modal.component.scss'],
  providers: [UnsubscribeService],
})
export class InfoComponentModalComponent implements OnInit {
  actionButtons: ComponentActionDto[] = [];

  constructor(
    private navModalService: NavigationModalService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
    public screenModalService: ScreenModalService,
  ) {}

  ngOnInit(): void {
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
    this.navModalService.next({});
  }
}
