import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, merge, of } from 'rxjs';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

import { CarDetailInfo } from '../containers/car-detail-info/car-detail-info.models';
import { VehicleOwnerInfo } from '../../car-list/models/car-list.interface';
import { ScreenService } from '../../../../../screen/screen.service';
import { NotaryInfo, ServiceResult } from '../models/car-info.interface';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';

@Injectable()
export class CarDetailInfoService {
  public isLoadingOwnerCarInfo$ = new BehaviorSubject<boolean>(false);
  public isLoadingNotaryInfo$ = new BehaviorSubject<boolean>(false);
  public vehicleInfo$ = new BehaviorSubject<CarDetailInfo<VehicleOwnerInfo> | null>(null);
  public notaryInfo$ = new BehaviorSubject<CarDetailInfo<NotaryInfo> | null>(null);
  public hasCommonError$ = combineLatest([this.vehicleInfo$, this.notaryInfo$]).pipe(
    map((data) => {
      const hasErrors = data.every(
        (info) => !!info && info.externalServiceCallResult === ServiceResult.EXTERNAL_SERVER_ERROR,
      );
      this.setState(data);

      return hasErrors;
    }),
  );
  public hasCommonLoading$ = combineLatest([
    this.isLoadingOwnerCarInfo$,
    this.isLoadingNotaryInfo$,
  ]).pipe(map((loadings) => loadings.every((loading) => loading)));
  public hasData$ = combineLatest([this.hasCommonError$, this.hasCommonLoading$]).pipe(
    map((data) => data.every((data) => !data)),
  );
  public hasVin = !!this.screenService.component.arguments.vin;

  constructor(
    private screenService: ScreenService,
    private configService: ConfigService,
    private http: HttpClient,
    private currentAnswerService: CurrentAnswersService,
  ) {}

  public fetchData(): void {
    this.currentAnswerService.isValid = true;
    if (this.hasVin) {
      this.parallelRequest().subscribe();
      return;
    }

    this.sequentialRequest().subscribe();
  }

  public fetchNotaryInfo(): Observable<CarDetailInfo<NotaryInfo>> {
    this.notaryInfo$.next(null);
    this.isLoadingNotaryInfo$.next(true);
    return this.fetchInfo<CarDetailInfo<NotaryInfo>>('/form-backend/data/gibdd/notaryInfo').pipe(
      tap((response) => {
        this.isLoadingNotaryInfo$.next(false);
        this.notaryInfo$.next(response);
      }),
      catchError(() => {
        const data = {
          externalServiceCallResult: ServiceResult.EXTERNAL_SERVER_ERROR,
        };
        this.isLoadingNotaryInfo$.next(false);
        this.notaryInfo$.next(data);
        return of(data);
      }),
    );
  }

  public fetchVehicleInfo(): Observable<CarDetailInfo<VehicleOwnerInfo>> {
    this.vehicleInfo$.next(null);
    this.isLoadingOwnerCarInfo$.next(true);
    return this.fetchInfo<CarDetailInfo<VehicleOwnerInfo>>('/form-backend/data/gibdd/vehicleFullInfo').pipe(
      tap((response) => {
        this.isLoadingOwnerCarInfo$.next(false);
        this.vehicleInfo$.next(response);
      }),
      catchError(() => {
        const data = {
          externalServiceCallResult: ServiceResult.EXTERNAL_SERVER_ERROR,
        };
        this.isLoadingOwnerCarInfo$.next(false);
        this.vehicleInfo$.next(data);
        return of(data);
      }),
    );
  }

  private parallelRequest(): Observable<unknown> {
    return merge(this.fetchNotaryInfo(), this.fetchVehicleInfo());
  }

  private sequentialRequest(): Observable<unknown> {
    return this.fetchVehicleInfo().pipe(
      switchMap((response) => {
        this.screenService.component.arguments.vin = response.data.vin;
        return this.fetchNotaryInfo();
      }),
    );
  }

  private fetchInfo<T>(url: string): Observable<T> {
    return this.http.post<T>(`${this.configService.apiUrl}${url}`, this.screenService.getStore());
  }

  private setState(data: [CarDetailInfo<VehicleOwnerInfo>, CarDetailInfo<NotaryInfo>]): void {
    const [vehicleInfo, notaryInfo] = data;
    if (vehicleInfo && notaryInfo) {
      this.currentAnswerService.state = {
        vehicleInfo: {
          ...vehicleInfo.data,
          externalServiceCallResult: vehicleInfo.externalServiceCallResult,
        },
        notaryInfo: {
          ...notaryInfo.data,
          externalServiceCallResult: notaryInfo.externalServiceCallResult,
        },
      };
    }
  }
}
