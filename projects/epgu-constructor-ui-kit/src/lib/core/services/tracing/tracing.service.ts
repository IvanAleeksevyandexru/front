import { Inject, Injectable } from '@angular/core';
import { Tracer, BatchRecorder, jsonEncoder, ExplicitContext } from '@epgu/zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import { AllowedRemoteServices, TRACE_ALLOWED_REMOTE_SERVICES } from './tracing.token';
import { ConfigService } from '../config/config.service';
import { SessionService } from '../session/session.service';
import { KeyValueMap } from '@epgu/epgu-constructor-types';

@Injectable()
export class TracingService {
  private localServiceName = 'form-frontend';
  private _tracer: Tracer;
  private ctxImpl: ExplicitContext = new ExplicitContext();
  private recorder: BatchRecorder;
  private defaultTags: KeyValueMap = {
    serviceCode: '',
  };

  constructor(
    @Inject(TRACE_ALLOWED_REMOTE_SERVICES) private allowedRemoteServices: AllowedRemoteServices,
    private configService: ConfigService,
    private sessionService: SessionService,
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

    this._tracer = new Tracer({
      ctxImpl: this.ctxImpl,
      recorder: this.recorder,
      localServiceName: this.localServiceName,
      supportsJoin: true,
      defaultTags: this.defaultTags, // Need to pray that transfer by reference won't be changed to transfer by value
      isCascadeMode: this.configService.isZipkinCascadeMode ?? true,
    });

    this.defaultTags.userId = this.sessionService.userId;
    this.defaultTags.env = this.configService.zipkinEnv;
  }

  public isAllowedRemoteServices(url: string): boolean {
    return this.allowedRemoteServices.some((allowedRemote) => url.includes(allowedRemote));
  }

  public get tracer(): Tracer {
    return this._tracer;
  }

  public set serviceCode(serviceCode: string) {
    this.defaultTags.serviceCode = serviceCode;
  }
}
