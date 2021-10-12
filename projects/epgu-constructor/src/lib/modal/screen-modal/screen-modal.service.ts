import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormPlayerNavigation, Navigation } from '../../form-player/form-player.types';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';
import { FormPlayerBaseService } from '../../shared/services/form-player-base/form-player-base.service';
import {
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse,
  DTOActionAction,
} from '@epgu/epgu-constructor-types';

@Injectable()
export class ScreenModalService extends FormPlayerBaseService {
  public get minContentHeight$(): Observable<number> {
    return this.minContentHeightSubject.asObservable();
  }
  public get isInternalScenarioFinish$(): Observable<boolean> {
    return this.isInternalScenarioFinishSub.asObservable();
  }
  public get isInternalScenarioFinishValue(): boolean {
    return this.isInternalScenarioFinishSub.value;
  }

  private _initStore: FormPlayerApiSuccessResponse;
  private minContentHeight = 0;

  private minContentHeightSubject = new BehaviorSubject<number>(this.minContentHeight);
  private isInternalScenarioFinishSub = new BehaviorSubject<boolean>(false);

  constructor(
    public injector: Injector,
    public formPlayerService: FormPlayerService,
    public formPlayerApiService: FormPlayerApiService,
  ) {
    super(injector);
    this.logSuffix = 'MODAL';
  }

  resetStore(): void {
    this.updatePlayerLoaded(false);
    this._store = null;
    this._initStore = null;
  }

  /**
   * Вернет текущий стор
   */
  get initStore(): FormPlayerApiSuccessResponse {
    return this._initStore;
  }

  navigate(navigation: Navigation = {}, formPlayerNavigation: FormPlayerNavigation): void {
    if (!this._store) {
      this._store = JSON.parse(JSON.stringify(this.formPlayerService.store));
    }
    this.updateLoading(true);
    this.updateRequest(navigation);
    this.formPlayerApiService
      .navigate(this._store, navigation.options, formPlayerNavigation)
      .subscribe(
        /* jscpd:ignore-start */
        (response) => {
          this.processResponse(response);
        },
        (error) => {
          this.sendDataError(error);
        },
        () => this.updateLoading(false),
        /* jscpd:ignore-end */
      );
  }

  processResponse(response: FormPlayerApiResponse): void {
    if (this.hasError(response)) {
      this.sendDataError(response);
    } else {
      this.sendDataSuccess(response as FormPlayerApiSuccessResponse);
      this.processInitStore(response as FormPlayerApiSuccessResponse);
      this.isInternalScenarioFinish();
    }
  }

  processInitStore(response: FormPlayerApiSuccessResponse): void {
    if (!this._initStore) {
      this._initStore = response;
    }
  }

  isInternalScenarioFinish(): void {
    const isGoBackAction = ({ action }): boolean => action === DTOActionAction.goBackToMainScenario;
    const actions = this._store.scenarioDto?.display?.buttons || [];
    const isInternalScenarioFinish = actions.some(isGoBackAction);
    this.isInternalScenarioFinishSub.next(isInternalScenarioFinish);
  }

  getVerticalPaddings(): number {
    const screenModal = document.querySelector('.screen-modal');

    if (!screenModal) {
      return 0;
    }

    const style = window.getComputedStyle(screenModal, null);
    const paddingTop = style.getPropertyValue('padding-top');
    const paddingBottom = style.getPropertyValue('padding-bottom');
    const parsePadding = (value): number => {
      return parseInt(value.replace(/[^0-9\.]+/g, ''));
    };

    return parsePadding(paddingTop) + parsePadding(paddingBottom);
  }

  updateMinContentHeight(headerHeight: number): void {
    if (window.innerWidth <= 767) {
      this.minContentHeight = window.innerHeight - headerHeight - this.getVerticalPaddings();
    } else {
      this.minContentHeight = 0;
    }

    this.minContentHeightSubject.next(this.minContentHeight);
  }
}
