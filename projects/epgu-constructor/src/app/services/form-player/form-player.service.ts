import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SCREEN_TYPE } from '../../../constant/global';
import { ResponseInterface } from '../../../interfaces/epgu.service.interface';
import { FormPlayerNavigation } from '../../form-player.types';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { ComponentStateService } from '../component-state/component-state.service';

interface SendDataOptionsInterface {
  componentId?: string;
  goBack?: boolean;
}

@Injectable()
export class FormPlayerService {
  responseStore: ResponseInterface;
  componentId: string;
  screenType: string;
  playerLoaded = false;
  isLoading = false;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private componentStateService: ComponentStateService, // TODO: check service
  ) {}

  initData(): void {
    this.updateLoading(true);
    this.formPlayerApiService.getInitialData().subscribe(
      (response) => this.initResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }

  getScreenType(): string {
    return this.screenType;
  }

  navigate(formPlayerNavigation: FormPlayerNavigation, data?: any, options?: SendDataOptionsInterface) {
    this.updateLoading(true);
    this.updateRequest(data, options);
    this.formPlayerApiService.navigate(formPlayerNavigation, this.responseStore).subscribe(
      (response) => {
        this.processResponse(response);
      },
      (error) => {
        this.sendDataError(error);
      },
      () => this.updateLoading(false)
    );
  }

  processResponse(response: ResponseInterface): void {
    if (response?.scenarioDto?.errors) {
      this.sendDataError(response);
    } else {
      this.sendDataSuccess(response);
    }
  };

  updateRequest(data: any, options: SendDataOptionsInterface = {}): void {
    const componentId = options.componentId || this.componentId;
    const isCycledFields = !!Object.keys(this.responseStore?.scenarioDto?.currentCycledFields).length;
    this.responseStore.scenarioDto.currentValue = {};

    // TODO HARDCODE наверное компоненты должны поднимать готовый state,
    if (this.screenType === SCREEN_TYPE.CUSTOM || isCycledFields) {
      this.responseStore.scenarioDto.currentValue = data;
    } else {
      this.responseStore.scenarioDto.currentValue[componentId] = {
        visited: true,
        value: data || '',
      };
    }
  }

  sendDataSuccess(response): void {
    console.log('----- SET DATA ---------');
    console.log('request', this.responseStore);
    this.initResponse(response);
  }

  sendDataError(response): void {
    this.updateLoading(false);
    console.error('----- ERROR DATA ---------');
    if (response.scenarioDto?.errors?.length) {
      // NOTICE: passing business errors to components layers, do not change this logic!
      console.error(response.scenarioDto?.errors);
      this.initResponse(response);
    } else {
      console.error(response);
    }
  }

  initResponse(response: ResponseInterface): void {
    if (!response) {
      console.error('Invalid Reponse');
      return;
    }

    this.componentStateService.state = '';
    this.componentStateService.isValid = true;

    this.responseStore = response;
    const { display, errors, gender } = response.scenarioDto;
    this.componentId = display.components[0].id;
    this.screenType = display.type;

    const currentCycledFields = response.scenarioDto?.currentCycledFields;
    const applicantAnswers = response.scenarioDto?.applicantAnswers;

    this.screenService.updateScreenData({
      componentData: display,
      errors: errors ?? errors,
      gender: gender ?? gender,
      currentCycledFields: currentCycledFields ?? currentCycledFields,
      applicantAnswers: applicantAnswers ?? applicantAnswers
    });
    this.updatePlayerLoaded(true);

    // TODO: move it to log service
    console.log('----- GET DATA ---------');
    console.log('componentId:', display.components[0].id);
    console.log('componentType:', display.components[0].type);
    console.log('initResponse:', response);
  }

  private updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(this.isLoading);
    this.screenService.updateLoading(this.isLoading);
  }

  private updatePlayerLoaded(newState: boolean): void {
    this.playerLoaded = newState;
    this.playerLoadedSubject.next(this.playerLoaded);
  }
}
