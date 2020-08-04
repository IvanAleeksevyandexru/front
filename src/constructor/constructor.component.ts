import { Component, OnInit } from '@angular/core';
import { EpguService } from '../services/epgu.service';
import { COMPONENT_TYPE } from '../app/constant/global';
import { EgpuResponseInterface } from '../app/interfaces/epgu.service.interface';
import { EgpuResponseQuestionsDisplayComponentAttrsActionsInterface } from '../app/modules/questions/components/interface/question-block.interface';

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

  initResponse(response): void {
    if (!response) {
      console.error('Invalid Reponse');
      return;
    }

    this.response = response;
    const { display } = response;
    this.componentId = display.components[0].id;
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

  sendData(data) {
    this.response.currentValue[this.componentId] = { visited: true, value: data };
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

  nextStep() {
    this.sendData(true);
  }

  onAnswerSelect(data: EgpuResponseQuestionsDisplayComponentAttrsActionsInterface) {
    this.sendData(data.value);
  }
}
