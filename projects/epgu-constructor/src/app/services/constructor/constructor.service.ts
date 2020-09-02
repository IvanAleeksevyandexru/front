import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../../../constant/global';
import { DisplayInterface, Gender, ResponseInterface, ScenarioDto } from '../../../interfaces/epgu.service.interface';
import { ComponentStateService } from '../component-state/component-state.service';
import { RestService } from '../rest/rest.service';

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
  componentData: DisplayInterface;
  componentErrors: object;
  gender: Gender;
  isLoading = false;

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
    ).add(
      () => {
        this.isLoading = false;
      }
    );
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
      }
    ).add(
      () => {
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
      }
    ).add(
      () => {
        this.isLoading = false;
      }
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
    this.response = response;
    this.scenarioDto = response.scenarioDto;
    const { display, errors, gender } = response.scenarioDto;

    this.componentId = display.components[0].id;
    this.componentType = display.components[0].type;
    this.componentData = display;
    this.componentErrors = errors;
    this.gender = gender;
    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', response);
  }
}
