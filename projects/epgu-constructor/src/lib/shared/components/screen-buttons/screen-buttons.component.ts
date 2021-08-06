import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActionType, ScreenButton } from '@epgu/epgu-constructor-types';
import { EventBusService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { takeUntil } from 'rxjs/operators';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CertificateEaisdoService } from '../../services/certificate-eaisdo/certificate-eaisdo.service';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenButtonsComponent implements OnInit {
  @Input() screenButtons: ScreenButton[];
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;
  private isInformerScreen = false;

  constructor(
    private certificateEaisdoService: CertificateEaisdoService, // TODO: отвязать EaisdoGroupCostService переделать на EventBusService
    private eventBusService: EventBusService,
    private eaisdoGroupCostService: EaisdoGroupCostService, // TODO: отвязать EaisdoGroupCostService переделать на EventBusService
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isInformerScreen = this.screenButtons.some(
      (button) => button.type === ActionType.externalIntegration,
    );

    this.eaisdoGroupCostService.currentButtonsState$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.cdr.detectChanges());

    this.certificateEaisdoService.showButtons$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.cdr.detectChanges());
  }

  setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
    this.eventBusService.emit('screenButtonClicked', button);
  }

  calculateVisibility(button: ScreenButton): boolean {
    // TODO Будет лучше если компонент кнопок не будет ничего знать про другие сервисы,
    // Необходимо перенести логику показа/непоказа или выше в место откуда кнопки приходят или в сервис кнопок, который нужно написать
    if (this.isInformerScreen) {
      return (
        this.eaisdoGroupCostService.currentButtonsState.includes(button.type) ||
        this.certificateEaisdoService.showButtons
      );
    }
    return true;
  }
}
