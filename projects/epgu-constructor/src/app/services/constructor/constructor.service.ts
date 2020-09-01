import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../../../constant/global';
import { DisplayInterface, ResponseInterface, Gender, ScenarioDto } from '../../../interfaces/epgu.service.interface';
import { RestService } from '../rest/rest.service';
import { ComponentStateService } from '../component-state/component-state.service';
import { ScreenData } from '../../../interfaces/screen.interface';

interface SendDataOptionsInterface {
  componentId?: string;
  goBack?: boolean;
}

@Injectable()
export class ConstructorService {
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

  screenData: ScreenData = {
    componentData: this.componentData,
    gender: this.gender,
    errors: this.componentErrors,
  };

  constructor(
    public restService: RestService,
    private componentStateService: ComponentStateService,
    ) {
  }

  getData() {
    this.isLoading = true;
    this.restService.getData().subscribe(
      (response) => this.initResponse(response),
      (error) => {
        this.sendDataError(error);
      },
      () => this.isLoading = false
    );
  }

  getScreenType() {
    return this.componentData?.type;
  }

  nextStep(data?: any, options?: SendDataOptionsInterface) {
    this.isLoading = true;
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
        this.isLoading = false;
      }
    );
  }

  prevStep(data?: any) {
    this.isLoading = true;
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
      () => this.isLoading = false
    );
  }

  updateRequest(data: any, options: SendDataOptionsInterface = {}) {
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

  sendDataSuccess(response) {
    console.log('----- SET DATA ---------');
    console.log('request', this.response);
    this.initResponse(response);
  }

  sendDataError(response) {
    this.isError = true;
    this.isLoading = false;
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
    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', response);
  }
}
