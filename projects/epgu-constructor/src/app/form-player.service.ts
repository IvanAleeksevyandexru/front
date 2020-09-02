import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../constant/global';
import { ResponseInterface } from '../interfaces/epgu.service.interface';
import { ComponentStateService } from './services/component-state/component-state.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenService } from './screen/screen.service';
import { RestService } from './services/rest/rest.service';

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
    public restService: RestService,
    private screenService: ScreenService,
    private componentStateService: ComponentStateService, // TODO: check service
  ) {}

  initData(): void {
    this.updateLoading(true);
    this.restService.getData().subscribe(
      (response) => this.initResponse(response),
      (error) => this.sendDataError(error),
      () => this.updateLoading(false)
    );
  }

  getScreenType(): string {
    return this.screenType;
  }

  nextStep(data?: any, options?: SendDataOptionsInterface): void {
    this.updateLoading(true);
    this.updateRequest(data, options);
    this.restService.getNextStep(this.responseStore).subscribe(
      (response) => {
        this.processResponse(response);
      },
      (error) => {
        this.sendDataError(error);
      },
      () => {
        // TODO почему не отрабатывает если пришла ошибка 500;
        this.updateLoading(false);
      }
    );
  }

  prevStep(data?: any): void {
    this.updateLoading(true);
    this.updateRequest(data);
    this.restService.getPrevStep(this.responseStore).subscribe(
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

    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
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
