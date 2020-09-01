import { Injectable } from '@angular/core';
import { ScreenData } from '../../interfaces/screen.interface';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class ScreenService {
  private screenData: ScreenData;
  private screenDataSubject = new BehaviorSubject<ScreenData>(this.screenData);

  public screenData$: Observable<ScreenData> = this.screenDataSubject.asObservable();

  public updateScreenData(newState: ScreenData): void {
    this.screenData = newState;
    this.screenDataSubject.next(this.screenData);
  }
}
