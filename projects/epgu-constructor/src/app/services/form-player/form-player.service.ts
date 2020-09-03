import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../../../constant/global';
import { ResponseInterface } from '../../../interfaces/epgu.service.interface';
import { ComponentStateService } from '../component-state/component-state.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ScreenService } from '../../screen/screen.service';
import { FormPlayerApiService } from '../api/form-player-api/form-player-api.service';
import { FormPlayerNavigation, NavigationPayload } from '../../form-player.types';
import { ScreenResolverService } from '../screen-resolver/screen-resolver.service';

interface SendDataOptionsInterface {
  componentId?: string;
  goBack?: boolean;
}

@Injectable()
export class FormPlayerService {
  private store: ResponseInterface;
  private playerLoaded = false;
  private isLoading = false;
  private screenType: string;
  private componentId: string;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  private playerLoadedSubject = new BehaviorSubject<boolean>(this.playerLoaded);
  private storeSubject = new Subject<ResponseInterface>();

  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public playerLoaded$: Observable<boolean> = this.playerLoadedSubject.asObservable();
  public store$: Observable<ResponseInterface> = this.storeSubject.asObservable();

  constructor(
    public formPlayerApiService: FormPlayerApiService,
    private screenService: ScreenService,
    private screenResolverService: ScreenResolverService,
    private componentStateService: ComponentStateService, // TODO: check service
  ) {}

  initData(serviceId: string): void {
    this.updateLoading(true);
    this.formPlayerApiService.getInitialData(serviceId).subscribe(
      (response) => this.initResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }

  get screenComponent() {
    const screenComponent = this.screenResolverService.getScreenComponentByType(this.screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(this.screenType);
    }

    return screenComponent;
  }

  handleScreenComponentError(screenType: string) {
    // TODO: need to find a better way for handling this error, maybe show it on UI
    throw new Error(`We cant find screen component for this type: ${screenType}`);
  }


  navigate(serviceId: string, formPlayerNavigation: FormPlayerNavigation, navigationPayload?: NavigationPayload) {
    this.updateLoading(true);
    this.updateRequest(navigationPayload?.data, navigationPayload?.options);
    this.formPlayerApiService.navigate(serviceId, formPlayerNavigation, this.store).subscribe(
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
    const componentId = options?.componentId || this.componentId;
    const isCycledFields = !!Object.keys(this.store?.scenarioDto?.currentCycledFields).length;
    this.store.scenarioDto.currentValue = {};

    // TODO HARDCODE наверное компоненты должны поднимать готовый state,
    if (this.screenType === SCREEN_TYPE.CUSTOM || isCycledFields) {
      this.store.scenarioDto.currentValue = data;
    } else {
      this.store.scenarioDto.currentValue[componentId] = {
        visited: true,
        value: data || '',
      };
    }
  }

  sendDataSuccess(response): void {
    console.log('----- SET DATA ---------');
    console.log('request', this.store);
    this.initResponse(response);
  }

  sendDataError(response): void {
    this.updateLoading(false);
    console.error('----- ERROR DATA ---------');
    if (response.scenarioDto?.errors) {
      // business errors
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

    this.store = response;
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
    this.storeSubject.next(this.store);
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
