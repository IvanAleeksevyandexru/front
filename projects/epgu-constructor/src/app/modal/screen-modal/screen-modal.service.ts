import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DTOActionAction,
  FormPlayerApiResponse,
  FormPlayerApiSuccessResponse
} from '../../form-player/services/form-player-api/form-player-api.types';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerNavigation, Navigation } from '../../form-player/form-player.types';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';
import { FormPlayerBaseService } from '../../shared/services/form-player-base/form-player-base.service';

@Injectable()
export class ScreenModalService extends FormPlayerBaseService {
  private _initStore: FormPlayerApiSuccessResponse;
  private minContentHeight = 0;

  private minContentHeightSubject = new BehaviorSubject<number>(this.minContentHeight);
  private isInternalScenarioFinishSub = new BehaviorSubject<boolean>(false);

  public minContentHeight$: Observable<number> = this.minContentHeightSubject.asObservable();
  public isInternalScenarioFinish$: Observable<boolean> = this.isInternalScenarioFinishSub.asObservable();

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

    this.formPlayerApiService.navigate(this._store, navigation.options, formPlayerNavigation).subscribe(
      (response) => {
        this.processResponse(response);
      },
      (error) => {
        this.sendDataError(error);
      },
      () => this.updateLoading(false)
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
    if(!this._initStore) {
      this._initStore = response;
    }
  }

  isInternalScenarioFinish(): void {
    const isGoBackAction = ({ action }): boolean => action === DTOActionAction.goBackToMainScenario;
    const actions = this._store.scenarioDto?.display?.components[0]?.attrs?.actions || [];
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
      return parseInt(value.replace(/[^0-9\.]+/g,''));
    };

    return parsePadding(paddingTop) + parsePadding(paddingBottom);
  }

  updateMinContentHeight(headerHeight: number): void {
    if(window.innerWidth <= 768) {
      this.minContentHeight = window.innerHeight - headerHeight - this.getVerticalPaddings();
    } else {
      this.minContentHeight = 0;
    }

    this.minContentHeightSubject.next(this.minContentHeight);
  }
}
