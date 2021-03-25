/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TracingService } from '../../services/tracing/tracing.service';
import { Tracer } from 'zipkin';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import * as zipkin from 'zipkin';
import ZipkinHttpClient = zipkin.Instrumentation.HttpClient;
import { Injectable } from '@angular/core';

@Injectable()
export class TracingHttpInterceptor implements HttpInterceptor {

  constructor(
    private tracingService: TracingService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { tracer }: { tracer: Tracer } = this.tracingService;
    if (!tracer) {
      return next.handle(req);
    }

    const { url }: { url: string } = req;
    if (!this.tracingService.allowedRemoteServices.some(allowedRemote => url.includes(allowedRemote))) {
      return next.handle(req);
    }

    const remoteService = 'form-backend';
    if (!remoteService) {
      return next.handle(req);
    }

    return this.doIntercept(tracer, url, remoteService, req, next);
  }

  protected doIntercept(
    tracer: Tracer,
    url: string,
    remoteServiceName: string,
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const httpClient = new ZipkinHttpClient({
      remoteServiceName,
      tracer
    });
    const request = {
      url: req.url,
      headers: {}
    };
    const zipkinReq = httpClient.recordRequest(request, url, req.method);
    const zipkinHeaders = zipkinReq.headers as any;
    const traceId = tracer.id;

    req = req.clone({
      setHeaders: zipkinHeaders
    });

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          httpClient.recordResponse(traceId, event.status.toString());
        }
      }),
      catchError((err: any) => {
        httpClient.recordError(traceId, (JSON.stringify(err) as unknown) as Error);
        return throwError(err);
      })
    );
  }
}