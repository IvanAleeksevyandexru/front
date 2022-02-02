import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
import { ErrorService } from './error.service';

@Injectable()
export class GetVersionsService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  /** Uat */
  public getLibVersionsFromUat(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_UAT_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getServiceVersionsFromUat(): Observable<ServiceVersions> {
    return this.http.get<ServiceVersions>(SERVICE_VERSIONS_UAT_URL).pipe(
      map(this.trimKeysInServiceVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  /** Uat2 */
  public getLibVersionsFromUat2(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_UAT2_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  /** Dev-l11 */
  public getLibVersionsFromDevL11(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_DEV_L11_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getServiceVersionsFromDevL11(): Observable<ServiceVersions> {
    return this.http.get<ServiceVersions>(SERVICE_VERSIONS_DEV_L11_URL).pipe(
      map(this.trimKeysInServiceVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  /** Dev01 */
  public getLibVersionsFromDev01(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_DEV_01_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getServiceVersionsFromDev01(): Observable<ServiceVersions> {
    return this.http.get<ServiceVersions>(SERVICE_VERSIONS_DEV_01_URL).pipe(
      map(this.trimKeysInServiceVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  /** Dev02 */
  public getLibVersionsFromDev02(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_DEV_02_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getServiceVersionsFromDev02(): Observable<ServiceVersions> {
    return this.http.get<ServiceVersions>(SERVICE_VERSIONS_DEV_02_URL).pipe(
      map(this.trimKeysInServiceVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  /** Prod */
  public getLibVersionsFromProd(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_PROD_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  /** Prod Like */
  public getLibVersionsFromProdLike(): Observable<LibVersions> {
    return this.http.get<LibVersions>(LIB_VERSIONS_PROD_LIKE_URL).pipe(
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getServiceVersionsFromProdLike(): Observable<ServiceVersions> {
    return this.http.get<ServiceVersions>(SERVICE_VERSIONS_PROD_LIKE_URL).pipe(
      map(this.trimKeysInServiceVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
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
