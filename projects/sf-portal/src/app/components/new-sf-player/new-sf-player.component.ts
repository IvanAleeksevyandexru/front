import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { forkJoin, Observable, of, Subscription, zip } from 'rxjs';
import { GetServiceRequest, Region, Service, ServicePermission } from '@epgu/ui/models';
import { LoadService } from '@epgu/ui/services/load';
import { LocationService } from '@epgu/ui/services/location';
import { CardsFormsService, RegionServiceCheck, ServerFormData, ServiceInfoDepartment } from './cards-forms.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'portal-new-sf-player',
  templateUrl: './new-sf-player.component.html',
  styleUrls: ['./new-sf-player.component.scss']
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
  private regionServiceCheck: RegionServiceCheck = null;
  private region: Region;

  private readonly orderIdRaw: string = this.route.snapshot.queryParamMap.get('parentOrderId') ||
    this.route.snapshot.paramMap.get('orderId');
  private readonly billNumber: string = this.route.snapshot.queryParamMap.get('billNumber');
  private readonly routeNumber: string = this.route.snapshot.queryParamMap.get('routeNumber');

  public newSfService: ServerFormData = null;

  constructor(
    public route: ActivatedRoute,
    public cardsFormsService: CardsFormsService,
    public loadService: LoadService,
    public locationService: LocationService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  public ngOnInit(): void {
    this.document.querySelector('.main-container').classList.add('new-sf-player');
    const params = new GetServiceRequest(this.passportId, this.targetId, false, false, true);
    this.isEmbedded = this.cardsFormsService.checkIsEmbedded(this.route.snapshot.data);
    this.locationService.savedDetectRegion$
      .pipe(
        filter(region => region !== null),
        take(1),
        switchMap(data => {
          this.region = data;
          this.loadService.attributes.selectedRegion = this.region.code;
          return this.cardsFormsService.getService(params).pipe(
            filter(service => service !== null),
            switchMap(service => {
              this.service = service;
              return this.checkPermissionsAndRegion()
            })
          )
        }))
      .subscribe((res: [Array<ServicePermission>, RegionServiceCheck]) => {
        if (res[0] && res[0].length) {
          this.permissionData = res[0][0];
        } else {
          this.regionServiceCheck = res[1];
          this.findParamsToNewSf();
        }
      }, (error) => {
        if (error.status === 404) {
          location.href = `${this.loadService.config.betaUrl}404`;
        }
      });
  }


  /***
   * проверка доступности услуги по уровню учетной записи, получение выбранного региона и проверка доступности услуги по региону
   ***/
  private checkPermissionsAndRegion(): any {
    return forkJoin([
      this.checkTarget(this.passportId, this.targetId),
      this.checkServiceByRegion(this.passportId, this.targetId)
    ]).pipe(
      finalize(() => {
        this.checkInProgress = false;
      }))
  }

  private checkTarget(passportId: string, targetId: string): Observable<Array<ServicePermission>> {
    return this.cardsFormsService.checkTarget(passportId, targetId)
      .pipe(
        catchError(() => {
          return of([{
            code: 'default',
            hint: 'Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в <a href="/help">службу поддержки</a>.',
            internalCode: 'InternalError',
            message: 'Не сработало'
          }]);
        }));
  }

  private checkServiceByRegion(passportId: string, targetId: string): Observable<Object> {
    return this.locationService.regionCheck(this.region.code, passportId, targetId)
      .pipe(catchError(err => {
        return of({err: err.status});
      }));
  }

  private findParamsToNewSf(): void {
    const selected = this.service.passport.services.find((v) => {
      return v.selected;
    });
    if (selected?.id) {
      const orderType = this.service.additionalAttributes.find(
        (item) => item.name === 'ORDER_TYPE');

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
            path: this.region.path
          },
          queryParams: this.route.snapshot.queryParams
        }
      };
    }
  }

  private getDepartmentInfo(): ServiceInfoDepartment {
    if (this.service.stateOrg?.length) {
      const targetState = this.service.stateOrg[this.service.stateOrg.length - 1];
      return {id: targetState.id, title: targetState.title};
    }
    return null;
  }

  public ngOnDestroy(): void {
    document.querySelector('.main').classList.remove('new-sf-player');
  }
}
