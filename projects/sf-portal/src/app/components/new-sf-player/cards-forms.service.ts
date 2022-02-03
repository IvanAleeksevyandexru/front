import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Data } from '@angular/router';
import { LoadService } from '@epgu/ui/services/load';
import { CatalogService } from '@epgu/ui/services/catalog';
import { BreadcrumbsService } from '@epgu/ui/services/breadcrumbs';
import {
  GetPassportRequest,
  GetServiceRequest,
  Passport,
  Service,
  ServicePermission,
} from '@epgu/ui/models';

@Injectable({
  providedIn: 'root',
})
export class CardsFormsService {
  public blockAttrByRadioOrderType = {
    online: 'order.button.disabled',
    mfc: 'mfc.button.disabled',
    equeue: 'booking.button.disabled',
    widget: 'widget.button.disabled',
    widgetnoauth: 'widgetnoauth.button.disabled',
  };

  private serviceCache: { [name: string]: Service } = {};

  private passportCache: { [name: string]: Passport } = {};

  constructor(
    private catalogService: CatalogService,
    private loadService: LoadService,
    private breadcrumbsService: BreadcrumbsService,
  ) {}

  public getService(params: GetServiceRequest): Observable<Service> {
    const observableServiceData = new BehaviorSubject<Service>(null);
    const cacheKey = JSON.stringify(params);
    if (this.serviceCache[cacheKey]) {
      observableServiceData.next(this.serviceCache[cacheKey]);
    } else {
      this.catalogService.getService(params).subscribe(
        (data: Service) => {
          this.serviceCache[cacheKey] = data;
          observableServiceData.next(data);
        },
        (error) => {
          observableServiceData.error(error);
        },
      );
    }
    return observableServiceData.asObservable();
  }

  public getPassport(params: GetPassportRequest): Observable<Passport> {
    const observablePassportData = new BehaviorSubject<Passport>(null);
    const cacheKey = JSON.stringify(params);
    if (this.passportCache[cacheKey]) {
      observablePassportData.next(this.passportCache[cacheKey]);
    } else {
      this.catalogService
        .getPassport(params)
        .pipe(catchError(() => of({ error: true })))
        .subscribe((data: Passport) => {
          this.passportCache[cacheKey] = data;
          observablePassportData.next(data);
        });
    }
    return observablePassportData.asObservable();
  }

  public checkTarget(passportId: string, targetId: string): Observable<Array<ServicePermission>> {
    return this.catalogService.checkPermissions(passportId, targetId);
  }

  public getAdditionalAttrValue(service: Service | Passport, attrName: string): AddAttrValue {
    const attr = service.additionalAttributes.find((item) => item.name === attrName);
    return attr?.value;
  }

  public isNewService(service: Service | Passport): boolean {
    return this.getAdditionalAttrValue(service, 'new_services') as boolean;
  }

  public checkIsEmbedded(routeData: Data): boolean {
    const loadServiceEmbedded = this.loadService.isEmbedded.getValue();
    if (loadServiceEmbedded) {
      return true;
    } else if (routeData && routeData.isEmbedded) {
      this.loadService.setIsEmbedded(true);
      return true;
    }
    return false;
  }

  public setBreadcrumbs(serviceName: string): void {
    this.breadcrumbsService.setLinks([
      {
        url: '/',
        name: 'Главная',
      },
      {
        url: '/catalog',
        name: 'Категории услуг',
      },
      {
        name: serviceName,
      },
    ]);
  }
}

export interface ServerFormData {
  serviceId: string;
  targetId: string;
  orderId?: number;
  canStartNew?: boolean;
  invited?: boolean;
  gepsId?: string;
  serviceInfo: ServiceInfo;
}

export interface ServiceInfo {
  department: ServiceInfoDepartment;
  routingCode: string;
  formPrefilling: boolean;
  infSysCode: string;
  billNumber: string;
  routeNumber: string;
  orderType: string;
  error?: string;
  userRegion: {
    name: string;
    path: string;
    codes: string[];
  };
  queryParams: Record<string, string>;
  formId: string;
}

export interface ServiceInfoDepartment {
  id: string;
  title: string;
}

export interface RegionServiceCheck {
  err?: number;
  formPrefilling: boolean;
  infSysCode: string;
  routingCode: string;
}

export type AddAttrValue = string | boolean | number;
