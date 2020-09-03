import { Injectable } from '@angular/core';
import { ScreenData } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class ScreenService {
  private screenData: ScreenData;
  private isLoading = false;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private screenDataSubject = new BehaviorSubject<ScreenData>(this.screenData);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public screenData$: Observable<ScreenData> = this.screenDataSubject.asObservable();

  public updateScreenData(newState: ScreenData): void {
    this.screenData = newState;
    this.screenDataSubject.next(this.screenData);
  }

  public updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(this.isLoading);
  }
}
