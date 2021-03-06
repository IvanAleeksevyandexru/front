import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import {
  BusEventType,
  EventBusService,
  LoggerService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { filter, takeUntil } from 'rxjs/operators';
import {
  ActionApiResponse,
  ActionType,
  DTOActionAction,
  EaisdoResponse,
  ScreenButton,
} from '@epgu/epgu-constructor-types';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { EXTERNAL_INTEGRATION_ACTION } from '../../../../shared/constants/actions';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';
import CertificateEaisdoModelAttrs from './CertificateEaisdoModelAttrs';
import CertificateEaisdoModel from './CertificateEaisdoModel';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-certificate-eaisdo',
  templateUrl: './certificate-eaisdo.html',
  styleUrls: ['./certificate-eaisdo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class CertificateEaisdoComponent
  extends AbstractComponentListItemComponent<CertificateEaisdoModelAttrs>
  implements OnInit {
  public component: CertificateEaisdoModel;
  private _hasError = false;

  public constructor(
    public injector: Injector,
    private actionService: ActionService,
    private certificateEaisdoService: CertificateEaisdoService,
    private screenService: ScreenService,
    private eventBusService: EventBusService,
    private logger: LoggerService,
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.component = this.control.value;
    this.eventBusService
      .on(BusEventType.ScreenButtonClicked)
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter(
          (button: ScreenButton) => button.action === DTOActionAction.externalIntegrationAction,
        ),
      )
      .subscribe(() => this.tryFetchCertificate());
    this.tryFetchCertificate();
  }

  public outputHtml(): string {
    return this.hasError ? this.component?.attrs.error : this.component?.attrs.wait;
  }

  private get hasError(): boolean {
    return this._hasError;
  }

  private set hasError(value: boolean) {
    this._hasError = value;
    this.certificateEaisdoService.showButtons = this._hasError;
    this.cdr.markForCheck();
  }

  private tryFetchCertificate(): void {
    this.hasError = false;
    this.screenService.updateLoading(true);
    this.actionService
      .handleExternalIntegrationAction(EXTERNAL_INTEGRATION_ACTION, this.component.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
        (response: ActionApiResponse<EaisdoResponse>) => this.handleResponse(response),
        (error) => this.handleError(error),
      );
  }

  private handleResponse(response: ActionApiResponse<EaisdoResponse>): void {
    this.screenService.updateLoading(false);
    const hasErrors = !!response.message;
    const isTimeout = response.status === 'REQUEST_TIMEOUT';
    if (hasErrors || isTimeout) {
      this.handleError(null);
    } else {
      this.control.get('value').setValue(response);
      this.formService.emitChanges();
      this.actionService.switchAction(
        {
          label: 'nextStep',
          type: ActionType.nextStep,
          action: DTOActionAction.getNextStep,
        },
        this.component.id,
      );
    }
  }

  private handleError(error: unknown): void {
    if (error !== null) {
      this.logger.error([error]);
    }
    this.hasError = true;
    this.screenService.updateLoading(false);
  }
}
