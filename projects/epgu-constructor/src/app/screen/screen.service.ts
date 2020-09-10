import { Injectable } from '@angular/core';
import { ScreenStore } from './screen.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApplicantAnswersService } from '../shared/services/applicant-answers/applicant-answers.service';
import { ComponentStateService } from '../services/component-state/component-state.service';


@Injectable()
export class ScreenService {
  private screenStore: ScreenStore;
  private isLoading = false;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private screenStoreSubject = new BehaviorSubject<ScreenStore>(this.screenStore);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public screenData$: Observable<ScreenStore> = this.screenStoreSubject.asObservable();

  constructor (
    private applicantAnswersService: ApplicantAnswersService,
    private componentStateService: ComponentStateService,
  ) {}

  public initScreenStore(store: ScreenStore): void {
    this.screenStore = store;
    this.loadAnsweredValues();
    this.initComponentStateService();
    this.screenStoreSubject.next(this.screenStore);
  }

  public updateScreenStore(newState: ScreenStore): void {
    this.screenStore = { ...this.screenStore, ...newState };
    this.screenStoreSubject.next(this.screenStore);
  }

  public updateLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.isLoadingSubject.next(this.isLoading);
  }

  private initComponentStateService() {
    this.componentStateService.state = '';
    this.componentStateService.isValid = true;
  }

  private loadAnsweredValues(): void {
    const components = [];

    this.screenStore.display.components.forEach(item => {
      const answeredValue = this.applicantAnswersService
        .getAnsweredValueById(this.screenStore.applicantAnswers, item.id);

      const component = answeredValue ? { ...item, value: answeredValue } : item;
      components.push(component);
    });

    this.screenStore.display = { ...this.screenStore.display, components };
  }

  public getStore(): ScreenStore {
    return this.screenStore;
  }
}
