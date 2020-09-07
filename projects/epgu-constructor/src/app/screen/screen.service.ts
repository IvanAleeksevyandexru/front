import { Injectable } from '@angular/core';
import { ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicantAnswersService } from '../shared/services/applicant-answers/applicant-answers.service';


@Injectable()
export class ScreenService {
  private screenStore: ScreenStore;
  private isLoading = false;
  private isShow = true; // Показываем или нет

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private isShowSubject = new BehaviorSubject<boolean>(this.isShow);
  private screenStoreSubject = new BehaviorSubject<ScreenStore>(this.screenStore);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public isShow$: Observable<boolean> = this.isShowSubject.asObservable();
  public screenData$: Observable<ScreenStore> = this.screenStoreSubject.asObservable();

  constructor (private applicantAnswersService: ApplicantAnswersService) {}

  /**
   * Инициализирует работу хранилища
   * @param store - объект хранилища
   */
  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.loadAnsweredValues();
    this.screenStoreSubject.next(this.screenStore);
  }

  /**
   * Установка выбранных данных на экране
   * @param newState - данные ответа
   */
  public updateScreenStore(newState: ScreenStore): void {
    this.screenStore = { ...this.screenStore, ...newState };
    this.screenStoreSubject.next(this.screenStore);
  }

  /**
   * Обновляет статус "в загрузке" для кнопки
   * @param isLoading - показывать загрузку?
   */
  public updateLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.isLoadingSubject.next(this.isLoading);
  }

  /**
   * Подгружает ответы пользователя
   */
  private loadAnsweredValues(): void {
    const components = [];

    this.screenStore.display.components.forEach(item => {
      const answeredValue = this.applicantAnswersService
        .getAnsweredValueById(this.screenStore.applicantAnswers, item.id);

      const component = answeredValue ? { ...item, value: answeredValue } : item;
      components.push(component);
    });

    this.screenStore.display = { ...this.screenStore.display, components };

    console.log('________Store with answered data___________');
    console.log('componentId:', this.screenStore.display.components[0].id);
    console.log('componentType:', this.screenStore.display.components[0].type);
    console.log('store', this.screenStore);
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
