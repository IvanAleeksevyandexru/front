import { Injectable } from '@angular/core';
import { Tracer, BatchRecorder, jsonEncoder, ExplicitContext } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import { ConfigService } from '../config/config.service';
import { ScreenService } from '../../../screen/screen.service';
import { SessionService } from '../session/session.service';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../unsubscribe/unsubscribe.service';
import { FormPlayerNavigation } from '../../../form-player/form-player.types';

@Injectable()
export class TracingService {
  public localServiceName = 'form-frontend';
  public tracer: Tracer;
  public allowedRemoteServices: Array<string> = [];
  private ctxImpl: ExplicitContext = new ExplicitContext();
  private recorder: BatchRecorder;
  private defaultTags: { [key: string]: string } = {};

  constructor(
    private configService: ConfigService,
    private screenService: ScreenService,
    private sessionService: SessionService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  public init(isEnabled: boolean = false): void {
    if (!isEnabled) return;

    this.recorder = new BatchRecorder({
      logger: new HttpLogger({
        endpoint: this.configService.zipkinUrl, // Required
        jsonEncoder: jsonEncoder.JSON_V2, // JSON encoder to use. Optional (defaults to JSON_V1)
        httpInterval: 1000, // How often to sync spans. Optional (defaults to 1000)
        timeout: 0, // Timeout for HTTP Post. Optional (defaults to 0)
        maxPayloadSize: this.configService.zipkinMaxPayloadSize || 0, // Max payload size for zipkin span. Optional (defaults to 0)
      }),
    });

    this.tracer = new Tracer({
      ctxImpl: this.ctxImpl,
      recorder: this.recorder,
      localServiceName: this.localServiceName,
      supportsJoin: true,
      defaultTags: this.defaultTags,
    });

    this.allowedRemoteServices = [
      this.configService.dictionaryUrl,
      FormPlayerNavigation.NEXT,
      FormPlayerNavigation.PREV,
      FormPlayerNavigation.SKIP,
      'getService',
    ];

    this.defaultTags.serviceCode = '';
    this.defaultTags.userId = this.sessionService.userId;
    this.defaultTags.env = this.configService.zipkinEnv;

    this.onServiceCodeChangeHandler();
  }
  private onServiceCodeChangeHandler(): void {
    this.screenService.serviceCode$
      .pipe(
        filter((serviceCode) => serviceCode !== null),
        distinctUntilChanged((prevServiceCode, nextServiceCode) => prevServiceCode === nextServiceCode),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe((serviceCode: string) => {
        this.defaultTags.serviceCode = serviceCode;
      });
  }
}
