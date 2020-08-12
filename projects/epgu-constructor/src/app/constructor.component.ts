import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { COMPONENT_TYPE } from '../constant/global';
// eslint-disable-next-line max-len
import { ConstructorService } from './services/constructor/constructor.service';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss', '../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConstructorComponent implements OnInit {
  // <--constant
  constructorComponentType = COMPONENT_TYPE;

  constructor(public constructorService: ConstructorService) {}

  ngOnInit(): void {
    this.constructorService.getData();
  }

  onEmailSelect(email: string): void {
    this.constructorService.nextStep(email, { componentId: 'errorScr' });
  }

  nextStepFromCustomScreen(data) {
    console.log(data);
    this.constructorService.nextStep('asdasdas');
  }

  nextStep(data?: any) {
    this.constructorService.nextStep(data);
  }
  prevStep(data?: any) {
    this.constructorService.prevStep(data);
  }
}
