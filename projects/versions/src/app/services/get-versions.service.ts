import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LibVersions, ServiceVersions } from '../shared/interfaces';
import {
  LIB_VERSIONS_DEV_01_URL,
  LIB_VERSIONS_DEV_02_URL,
  LIB_VERSIONS_DEV_L11_URL,
  LIB_VERSIONS_PROD_LIKE_URL,
  LIB_VERSIONS_PROD_URL,
  LIB_VERSIONS_UAT2_URL,
  LIB_VERSIONS_UAT_URL,
  SERVICE_VERSIONS_DEV_01_URL,
  SERVICE_VERSIONS_DEV_02_URL,
  SERVICE_VERSIONS_DEV_L11_URL,
  SERVICE_VERSIONS_PROD_LIKE_URL,
  SERVICE_VERSIONS_UAT_URL,
} from '../shared/constants';

@Injectable()
export class GetVersionsService {
  constructor(private http: HttpClient) {}

  /** Uat */
  public getLibVersionsFromUat(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_UAT_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  public getServiceVersionsFromUat(): Observable<ServiceVersions> {
    return this.http
      .get<ServiceVersions>(SERVICE_VERSIONS_UAT_URL)
      .pipe(filter(Boolean), map(this.trimKeysInServiceVersions));
  }

  /** Uat2 */
  public getLibVersionsFromUat2(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_UAT2_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  /** Dev-l11 */
  public getLibVersionsFromDevL11(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_DEV_L11_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  public getServiceVersionsFromDevL11(): Observable<ServiceVersions> {
    return this.http
      .get<ServiceVersions>(SERVICE_VERSIONS_DEV_L11_URL)
      .pipe(filter(Boolean), map(this.trimKeysInServiceVersions));
  }

  /** Dev01 */
  public getLibVersionsFromDev01(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_DEV_01_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  public getServiceVersionsFromDev01(): Observable<ServiceVersions> {
    return this.http
      .get<ServiceVersions>(SERVICE_VERSIONS_DEV_01_URL)
      .pipe(filter(Boolean), map(this.trimKeysInServiceVersions));
  }

  /** Dev02 */
  public getLibVersionsFromDev02(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_DEV_02_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  public getServiceVersionsFromDev02(): Observable<ServiceVersions> {
    return this.http
      .get<ServiceVersions>(SERVICE_VERSIONS_DEV_02_URL)
      .pipe(filter(Boolean), map(this.trimKeysInServiceVersions));
  }

  /** Prod */
  public getLibVersionsFromProd(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_PROD_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  /** Prod Like */
  public getLibVersionsFromProdLike(): Observable<LibVersions> {
    return this.http
      .get<LibVersions>(LIB_VERSIONS_PROD_LIKE_URL)
      .pipe(filter(Boolean), map(this.trimKeysInLibVersions));
  }

  public getServiceVersionsFromProdLike(): Observable<ServiceVersions> {
    return this.http
      .get<ServiceVersions>(SERVICE_VERSIONS_PROD_LIKE_URL)
      .pipe(filter(Boolean), map(this.trimKeysInServiceVersions));
  }

  /** Trimming methods */
  private trimKeysInServiceVersions(versions: ServiceVersions): ServiceVersions {
    const keyValues = Object.keys(versions).map((key) => {
      const index = key.indexOf('-version');
      return index !== -1 ? { [key.slice(0, index)]: versions[key] } : { [key]: versions[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  private trimKeysInLibVersions(versions: LibVersions): LibVersions {
    const keyValues = Object.keys(versions).map((key) => {
      const index = key.indexOf('Version');
      return index !== -1 ? { [key.slice(0, index)]: versions[key] } : { [key]: versions[key] };
    });
    return Object.assign({}, ...keyValues);
  }
}
