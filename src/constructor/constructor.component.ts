import { Component, OnInit } from '@angular/core';
import { EpguService } from '../app/services/epgu.service';
import { COMPONENT_TYPE } from '../app/constant/global';
import { EgpuResponseInterface } from '../app/interfaces/epgu.service.interface';
// eslint-disable-next-line max-len
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from '../app/modules/questions/components/interface/question-block.interface';
import { CUSTOM_COMPONENT_ITEM_TYPE } from '../app/modules/custom/tools/custom-screen-tools';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss'],
})
export class ConstructorComponent implements OnInit {
  // <--constant
  constructorComponentType = COMPONENT_TYPE;
  // <-- variable
  response: EgpuResponseInterface;
  componentId: string;
  componentType: string;
  componentData: any;

  constructor(public epguService: EpguService) {}

  ngOnInit(): void {
    this.epguService.getData().subscribe(
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

    // TODO HARDCODE
    // eslint-disable-next-line max-len
    this.componentId =
      response.display.type === COMPONENT_TYPE.CUSTOM
        ? display.components.find((item) => item.type !== CUSTOM_COMPONENT_ITEM_TYPE.LabelSection)
            .id
        : display.components[0].id;
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

  sendData(data, componentId?: string) {
    this.response.currentValue[componentId || this.componentId] = { visited: true, value: data };
    this.epguService.setData(this.response).subscribe(
      (response) => {
        console.log('----- SET DATA ---------');
        console.log('request', this.response);
        this.initResponse(response);
      },
      (error) => {
        console.error(error);
      },
    );
  }

  nextStep(data?: any) {
    this.sendData(data || true);
  }

  onAnswerSelect(data: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface) {
    this.sendData(data.value);
  }

  onEmailSelect(email: string): void {
    this.sendData(email, 'errorScr');
  }

  nextStepFromCustomScreen(data) {
    console.log(data);
    this.sendData('asdasdas');
  }
}
