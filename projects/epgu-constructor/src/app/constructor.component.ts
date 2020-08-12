import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestService } from './services/rest/rest.service';
import { COMPONENT_TYPE } from '../constant/global';
import { EgpuResponseInterface } from '../interfaces/epgu.service.interface';
// eslint-disable-next-line max-len
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from './modules/questions/components/interface/question-block.interface';
import { CUSTOM_COMPONENT_ITEM_TYPE } from './modules/custom/tools/custom-screen-tools';

interface SendDataOptionsInterface {
  componentId?: string;
  goBack?: boolean;
}

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss', '../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConstructorComponent implements OnInit {
  // <--constant
  constructorComponentType = COMPONENT_TYPE;

  // <-- variable
  response: EgpuResponseInterface;
  componentId: string;
  componentType: string;
  componentData: any;

  constructor(public restService: RestService) {}

  ngOnInit(): void {
    this.restService.getData().subscribe(
      (response) => {
        this.initResponse(response);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  initResponse(response: EgpuResponseInterface): void {
    if (!response) {
      console.error('Invalid Reponse');
      return;
    }

    this.response = response;
    const { display } = response;

    // <-- start TODO HARDCODE
    // eslint-disable-next-line max-len
    this.componentId =
      response.display.type === COMPONENT_TYPE.CUSTOM
        ? display.components.find((item) => item.type !== CUSTOM_COMPONENT_ITEM_TYPE.LabelSection)
            .id
        : display.components[0].id;
    // <-- end TODO HARDCODE
    this.componentType = display.components[0].type;
    this.componentData = display;
    // this.componentData.header = 'Кому из детей требуется оформить загранпаспорт?';
    // this.componentData.type = 'CUSTOM';
    // this.componentData.components[0].type;
    console.log('----- GET DATA ---------');
    console.log('componentId:', this.componentId);
    console.log('componentType:', this.componentType);
    console.log('initResponse:', display);
  }

  nextStep(data?: any, options?: SendDataOptionsInterface) {
    this.updateRequest(data, options);
    this.restService.getNextStep(this.response).subscribe(
      (response) => this.sendDataSuccess(response),
      (error) => this.sendDataError(error),
    );
  }

  prevStep(data?: any) {
    this.updateRequest(data);
    this.restService.getPrevStep(this.response).subscribe(
      (response) => this.sendDataSuccess(response),
      (error) => this.sendDataError(error),
    );
  }

  updateRequest(data: any, options: SendDataOptionsInterface = {}) {
    this.response.currentValue[options.componentId || this.componentId] = {
      visited: true,
      value: data,
    };
  }

  sendDataSuccess(response) {
    console.log('----- SET DATA ---------');
    console.log('request', this.response);
    this.initResponse(response);
  }

  sendDataError(error) {
    console.error(error);
  }

  onAnswerSelect(data: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface) {
    this.nextStep(data.value);
  }

  onEmailSelect(email: string): void {
    this.nextStep(email, { componentId: 'errorScr' });
  }

  nextStepFromCustomScreen(data) {
    console.log(data);
    this.nextStep('asdasdas');
  }
}
