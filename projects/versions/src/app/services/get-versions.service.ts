import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { BackendServices, LibVersions, ServiceVersions } from '../shared/interfaces';
import { ErrorService } from './error.service';

@Injectable()
export class GetVersionsService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  public getLibVersions(url: string, hasQueryParam = false): Observable<LibVersions> {
    const path = hasQueryParam ? `${url}?${new Date().getTime()}` : url;

    return this.http.get<LibVersions>(path).pipe(
      filter(Boolean),
      map(this.trimKeysInLibVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getServiceVersions(url: string, hasQueryParam = false): Observable<ServiceVersions> {
    const path = hasQueryParam ? `${url}?${new Date().getTime()}` : url;

    return this.http.get<ServiceVersions>(path).pipe(
      filter(Boolean),
      map(this.trimKeysInServiceVersions),
      catchError((err) => {
        this.errorService.handleError(err);
        return of(null);
      }),
    );
  }

  public getBackendServices(url: string): Observable<string> {
    return this.http.get<BackendServices>(url).pipe(
      map((value) => value?.app?.version),
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
