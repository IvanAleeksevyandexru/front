import { Injectable } from '@angular/core';
import { ComponentBase, ScreenStore } from './screen.types';
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
    this.loadValueFromApplicationAnswer();
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

  private loadValueFromApplicationAnswer(): void {
    const components: Array<ComponentBase> = [];

    if (Object.keys(this.screenStore.errors).length) {
      console.log('ScreenStore patched from a CurrentValue');
      this.screenStore.display.components.forEach((item: ComponentBase) => {
        components.push(
          this.getUpdatedComponentByValue(
            this.screenStore.currentValue[item.id]?.value,
            item,
          )
        );
      });
    } else {
      console.log('ScreenStore patched from an ApplicantAnswers');
      this.screenStore.display.components.forEach((item: ComponentBase) => {
        components.push(
          this.getUpdatedComponentByValue(
            this.applicantAnswersService.getAnsweredValueById(
              this.screenStore.applicantAnswers,
              item.id,
            ),
            item,
          )
        );
      });
    }

    this.screenStore.display = { ...this.screenStore.display, components };
  }

  private getUpdatedComponentByValue(value: string, component: ComponentBase): ComponentBase {
    return value ? { ... component, value } : component;
  }
}
