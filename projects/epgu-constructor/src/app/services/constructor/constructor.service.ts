import { Injectable } from '@angular/core';
import { SCREEN_TYPE } from '../../../constant/global';
import { DisplayInterface, ResponseInterface } from '../../../interfaces/epgu.service.interface';
import { RestService } from '../rest/rest.service';

interface SendDataOptionsInterface {
  componentId?: string;
  goBack?: boolean;
}

@Injectable()
export class ConstructorService {
  // <-- variable
  response: ResponseInterface;
  componentId: string;
  componentType: string;
  componentData: DisplayInterface;
  componentErrors: object;
  isLoading = false;

  constructor(public restService: RestService) {
  }

  getData() {
    this.isLoading = true;
    this.restService.getData().subscribe(
      (response) => this.initResponse(response),
      (error) => console.error(error),
      () => this.isLoading = false
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
      (error) => this.sendDataError(error),
      () => this.isLoading = false
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
      (error) => this.sendDataError(error),
      () => this.isLoading = false
    );
  }

  updateRequest(data: any, options: SendDataOptionsInterface = {}) {
    const componentId = options.componentId || this.componentId;
    this.response.scenarioDto.currentValue = {};

    // TODO HARDCODE наверное компоненты должны поднимать готовый state,
    if (this.componentData.type === SCREEN_TYPE.CUSTOM) {
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
    console.error(JSON.stringify(response.errors));
    this.initResponse(response);

  }

  initResponse(response: ResponseInterface): void {
    if (!response) {
      console.error('Invalid Reponse');
      return;
    }

    this.response = response;
    const { display, errors } = response.scenarioDto;

    this.componentId = display.components[0].id;
    this.componentType = display.components[0].type;
    this.componentData = display;
    this.componentErrors = errors;
    // this.componentData.header = 'Кому из детей требуется оформить загранпаспорт?';
    // this.componentData.type = 'CUSTOM';
    // this.componentData.components[0].type;
    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', display);
  }
}
