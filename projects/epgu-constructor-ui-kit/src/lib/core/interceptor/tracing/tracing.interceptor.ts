import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TracingService } from '../../services/tracing/tracing.service';
import { Tracer } from '@epgu/zipkin';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import * as zipkin from '@epgu/zipkin';
import ZipkinHttpClient = zipkin.Instrumentation.HttpClient;
import { Injectable } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';

@Injectable()
export class TracingHttpInterceptor implements HttpInterceptor {
  constructor(private tracingService: TracingService, private configService: ConfigService) {}

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { tracer }: { tracer: Tracer } = this.tracingService;
    if (!tracer) {
      return next.handle(req);
    }

    const { url }: { url: string } = req;
    if (!this.tracingService.isAllowedRemoteServices(url)) {
      return next.handle(req);
    }

    if (this.configService.zipkinSpanSendEnabled) {
      return this.doIntercept(tracer, url, req, next);
    } else {
      return next.handle(req);
    }
  }

  private doIntercept(
    tracer: Tracer,
    url: string,
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const httpClient = new ZipkinHttpClient({
      tracer,
    });
    const request = {
      url: req.url,
      headers: {},
    };
    const zipkinReq = httpClient.recordRequest(request, url, req.method);
    const zipkinHeaders = zipkinReq.headers;
    const traceId = tracer.id;

    req = req.clone({
      setHeaders: zipkinHeaders,
    });

    return next.handle(req).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          httpClient.recordResponse(traceId, event.status.toString());
        }
      }),
      catchError((err: HttpErrorResponse) => {
        httpClient.recordError(traceId, (JSON.stringify(err) as unknown) as Error);
        return throwError(err);
      }),
    );
  }
}
