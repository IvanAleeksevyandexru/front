import { Injectable } from '@angular/core';
import { ScreenData } from '../../interfaces/screen.interface';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class ScreenService {
  private screenData: ScreenData;
  private isLoading = false; // Статус в загрузке
  private isShow = true; // Показываем или нет

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private isShowSubject = new BehaviorSubject<boolean>(this.isShow);
  private screenDataSubject = new BehaviorSubject<ScreenData>(this.screenData);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public isShow$: Observable<boolean> = this.isShowSubject.asObservable();
  public screenData$: Observable<ScreenData> = this.screenDataSubject.asObservable();

  /**
   * Установка выбранных данных на экране
   * @param newState - данные ответа
   */
  public updateScreenData(newState: ScreenData): void {
    this.screenData = newState;
    this.screenDataSubject.next(this.screenData);
  }

  /**
   * Обновляет статус "в загрузке" для кнопки
   * @param newState - показывать загрузку?
   */
  public updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(this.isLoading);
  }

  /**
   * Обновляет статус показывать кнопку или нет
   * @param newState - показывать кнопку?
   */
  public updateIsShow(newState: boolean): void {
    this.isShow = newState;
    this.isShowSubject.next(this.isShow);
  }
}
