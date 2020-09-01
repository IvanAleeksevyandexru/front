import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../../../constant/global';
import { DisplayInterface, ResponseInterface, Gender, ScenarioDto } from '../../../interfaces/epgu.service.interface';
import { RestService } from '../rest/rest.service';
import { ComponentStateService } from '../component-state/component-state.service';
import { ScreenData } from '../../../interfaces/screen.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScreenService } from '../../screen/screen.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';

interface SendDataOptionsInterface {
  componentId?: string;
  goBack?: boolean;
}

@Injectable()
export class FormPlayerService {
  // TODO: remove unused fields, make used fields private, use reactive way
  // <-- variable
  response: ResponseInterface;
  scenarioDto: ScenarioDto;
  componentId: string;
  componentType: string;
  isLoading = false;
  isError = false;

  // TODO: remove when complete refactoring of screens
  componentData: DisplayInterface;
  componentErrors: object;
  gender: Gender;

  private isLoadingSubject = new BehaviorSubject<boolean>(this.isLoading);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();


  constructor(
    public restService: RestService,
    private screenService: ScreenService,
    private componentStateService: ComponentStateService,
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
    return this.componentData?.type;
  }

  nextStep(data?: any, options?: SendDataOptionsInterface): void {
    this.updateLoading(true);
    this.updateRequest(data, options);
    this.restService.getNextStep(this.response).subscribe(
      (response) => {
        // TODO возможно стоит обернуть в pipe и делоть throwError
        if (response?.scenarioDto?.errors) {
          this.sendDataError(response);
        } else {
          this.sendDataSuccess(response);
        }
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
    this.restService.getPrevStep(this.response).subscribe(
      (response) => {
        if (response?.scenarioDto?.errors) {
          this.sendDataError(response);
        } else {
          this.sendDataSuccess(response);
        }
      },
      (error) => {
        this.sendDataError(error);
      },
      () => this.updateLoading(false)
    );
  }

  updateRequest(data: any, options: SendDataOptionsInterface = {}): void {
    const componentId = options.componentId || this.componentId;
    const isCycledFields = !!Object.keys(this.response?.scenarioDto?.currentCycledFields).length;
    this.response.scenarioDto.currentValue = {};

    // TODO HARDCODE наверное компоненты должны поднимать готовый state,
    if (this.componentData.type === SCREEN_TYPE.CUSTOM || isCycledFields) {
      this.response.scenarioDto.currentValue = data;
    } else {
      this.response.scenarioDto.currentValue[componentId] = {
        visited: true,
        value: data || '',
      };
    }
  }

  sendDataSuccess(response): void {
    console.log('----- SET DATA ---------');
    console.log('request', this.response);
    this.initResponse(response);
  }

  sendDataError(response): void {
    this.isError = true;
    this.updateLoading(false);
    console.error('----- ERROR DATA ---------');
    console.error(JSON.stringify(response.scenarioDto?.errors));
    this.initResponse(response);
  }

  initResponse(response: ResponseInterface): void {
    if (!response) {
      console.error('Invalid Reponse');
      return;
    }

    this.componentStateService.state = '';
    this.componentStateService.isValid = true;
    this.response = response;
    this.scenarioDto = response.scenarioDto;
    const { display, errors, gender } = response.scenarioDto;

    this.componentId = display.components[0].id;
    this.componentType = display.components[0].type;
    this.componentData = display;
    this.componentErrors = errors;
    this.gender = gender;
    this.isError = false;
    this.screenService.updateScreenData({
      componentData: display,
      errors: errors,
      gender: gender
    });
    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', response);
  }

  private updateLoading(newState: boolean): void {
    this.isLoading = newState;
    this.isLoadingSubject.next(this.isLoading);
  }
}
