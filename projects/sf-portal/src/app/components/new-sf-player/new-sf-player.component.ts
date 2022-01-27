/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { forkJoin, Observable, of, ObservableInput } from 'rxjs';
import { GetServiceRequest, Region, Service, ServicePermission } from '@epgu/ui/models';
import { LoadService } from '@epgu/ui/services/load';
import { LocationService } from '@epgu/ui/services/location';
import { DOCUMENT } from '@angular/common';
import { HealthService } from '@epgu/epgu-constructor-ui-kit';
import { RequestStatus } from '@epgu/epgu-constructor-types';
import { cloneDeep } from 'lodash';
import {
  CardsFormsService,
  RegionServiceCheck,
  ServerFormData,
  ServiceInfoDepartment,
} from './cards-forms.service';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'portal-new-sf-player',
  templateUrl: './new-sf-player.component.html',
  styleUrls: ['./new-sf-player.component.scss'],
})
export class NewSfPlayerComponent implements OnInit, OnDestroy {
  public readonly passportId: string = this.route.snapshot.paramMap.get('passportId');
  public readonly targetId: string = this.route.snapshot.paramMap.get('targetId');
  public loading = true;
  public isEmbedded = false;

  public service: Service;

  public checkInProgress = true;
  public permissionData: ServicePermission;
  public staticDomainAssetsPath = this.loadService.config.staticDomainAssetsPath;
  public newSfService: ServerFormData = null;

  private regionServiceCheck: RegionServiceCheck = null;
  private region: Region;

  private readonly orderIdRaw: string =
    this.route.snapshot.queryParamMap.get('parentOrderId') ||
    this.route.snapshot.paramMap.get('orderId');
  private readonly billNumber: string = this.route.snapshot.queryParamMap.get('billNumber');
  private readonly routeNumber: string = this.route.snapshot.queryParamMap.get('routeNumber');
  private readonly formId: string = this.router.url?.split('/').pop().split('?').shift();

  private hasIframe: boolean;

  constructor(
    public route: ActivatedRoute,
    public cardsFormsService: CardsFormsService,
    public loadService: LoadService,
    public locationService: LocationService,
    private router: Router,
    private health: HealthService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  public ngOnInit(): void {
    this.hasIframe = (window.self !== window.top);
    if(!this.hasIframe) {
      this.document.querySelector('.main-container')?.classList.add('new-sf-player');
      const params = new GetServiceRequest(this.passportId, this.targetId, false, false, true);
      this.isEmbedded = this.cardsFormsService.checkIsEmbedded(this.route.snapshot.data);
      this.locationService.savedDetectRegion$
        .pipe(
          filter((region) => region !== null),
          take(1),
          switchMap((data) => {
            this.region = data;
            this.loadService.attributes.selectedRegion = this.region.code;
            return this.cardsFormsService.getService(params).pipe(
              filter((service) => service !== null),
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              switchMap(
                (service): ObservableInput<any> => {
                  this.service = service;
                  return this.checkPermissionsAndRegion();
                },
              ),
            );
          }),
        )
        .subscribe(
          (res: [Array<ServicePermission>, RegionServiceCheck]) => {
            if (res[0] && res[0].length) {
              [[this.permissionData]] = res;
            } else {
              [, this.regionServiceCheck] = res;
              this.findParamsToNewSf();
            }
          },
          (error) => {
            if (error.status === 404) {
              window.location.href = `${this.loadService.config.betaUrl}404`;
            }
          },
        );
    } else {
      if (this.hasIframe) {
        window.parent.postMessage('init');
        if (window.addEventListener) {
          window.addEventListener('message', this.handleMessage.bind(this), false);
        } else if (window['attachEvent']) {
          window['attachEvent']('onmessage', this.handleMessage.bind(this));
        }
      }
    }
  }

  public ngOnDestroy(): void {
    this.document.querySelector('.main').classList.remove('new-sf-player');
  }

  /** *
   * проверка доступности услуги по уровню учетной записи, получение выбранного региона и проверка доступности услуги по региону
   ** */
  private checkPermissionsAndRegion(): ObservableInput<any> {
    return forkJoin([
      this.checkTarget(this.passportId, this.targetId),
      this.checkServiceByRegion(this.passportId, this.targetId),
    ]).pipe(
      finalize(() => {
        this.checkInProgress = false;
      }),
    );
  }

  private checkTarget(passportId: string, targetId: string): Observable<Array<ServicePermission>> {
    return this.cardsFormsService.checkTarget(passportId, targetId).pipe(
      catchError(() => {
        return of([
          {
            code: 'default',
            hint:
              'Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в <a href="/help">службу поддержки</a>.',
            internalCode: 'InternalError',
            message: 'Не сработало',
          },
        ]);
      }),
    );
  }

  private checkServiceByRegion(passportId: string, targetId: string): Observable<Object> {
    return this.locationService.regionCheck(this.region.code, passportId, targetId).pipe(
      catchError((err) => {
        return of({ err: err.status });
      }),
    );
  }

  private findParamsToNewSf(): void {
    const selected = this.service.passport.services.find((v) => {
      return v.selected;
    });

    function getNormalizedQueryParams(queryParams: Object): Object {
      return Object.keys(queryParams).reduce((acc, key) => {
        const clonedQueryParams = cloneDeep(queryParams);

        if (Array.isArray(clonedQueryParams[key])) {
          clonedQueryParams[key] = clonedQueryParams[key].pop();
        }

        return { ...acc, ...{ [key]: clonedQueryParams[key] } };
      }, {});
    }

    if (selected?.id) {
      const orderType = this.service.additionalAttributes.find(
        (item) => item.name === 'ORDER_TYPE',
      );

      const canStartNewQueryParam = this.route.snapshot.queryParamMap.get('canStartNew');
      let canStartNew;
      if (canStartNewQueryParam !== null) {
        canStartNew = !(canStartNewQueryParam === 'false' || canStartNewQueryParam === '0');
      }

      const invitedQueryParam = this.route.snapshot.queryParamMap.get('invited');
      let invited;
      if (invitedQueryParam !== null) {
        invited = !(invitedQueryParam === 'false' || invitedQueryParam === '0');
      }

      let { queryParams } = this.route.snapshot;
      const hasQueryParamsArrays = Object.keys(queryParams).some((key) =>
        Array.isArray(queryParams[key]),
      );

      if (hasQueryParamsArrays) {
        const { url } = this.router;

        if (AppConfig.settings?.isHealthErrorsOn) {
          this.health.measureStart('queryParamsArrayError');
          this.health.measureEnd('queryParamsArrayError', RequestStatus.Failed, { url });
        }

        queryParams = getNormalizedQueryParams(queryParams);
      }

      this.newSfService = {
        serviceId: selected.id.eid,
        targetId: selected.id.lid,
        orderId: this.orderIdRaw ? parseInt(this.orderIdRaw, 10) : undefined,
        canStartNew,
        invited,
        gepsId: this.route.snapshot.queryParamMap.get('gepsId') ?? undefined,
        serviceInfo: {
          department: this.getDepartmentInfo(),
          error: this.regionServiceCheck.err ? 'Region not found' : '',
          formPrefilling: this.regionServiceCheck.formPrefilling,
          infSysCode: this.regionServiceCheck.infSysCode,
          routingCode: this.regionServiceCheck.routingCode,
          routeNumber: this.routeNumber,
          billNumber: this.billNumber,
          orderType: (orderType?.value as string) || 'ORDER',
          userRegion: {
            codes: this.region.codes,
            name: this.region.name,
            path: this.region.path,
          },
          queryParams,
          formId: this.formId,
        },
      };
    }
  }

  private getDepartmentInfo(): ServiceInfoDepartment {
    if (this.service.stateOrg?.length) {
      const targetState = this.service.stateOrg[this.service.stateOrg.length - 1];
      return { id: targetState.id, title: targetState.title };
    }
    return null;
  }

  private handleMessage(event: MessageEvent<ServerFormData>): void {
    if(typeof event.data === 'object' && 'serviceId' in event.data && 'targetId' in event.data) {
      this.newSfService = event.data;
      this.checkInProgress = false;
    }
  }
}
