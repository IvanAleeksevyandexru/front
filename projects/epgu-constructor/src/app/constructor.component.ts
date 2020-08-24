import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SCREEN_TYPE } from '../constant/global';
// eslint-disable-next-line max-len
import { ConstructorService } from './services/constructor/constructor.service';

@Component({
  selector: 'epgu-constructor-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['../styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConstructorComponent implements OnInit {
  // <--constant
  constructorComponentType = SCREEN_TYPE;

  constructor(public constructorService: ConstructorService) {}

  ngOnInit(): void {
    this.constructorService.getData();
  }

  onEmailSelect(email: string): void {
    this.constructorService.nextStep(email, { componentId: 'errorScr' });
  }

  nextStep(data?: any) {
    this.constructorService.nextStep(data);
  }
  prevStep(data?: any) {
    this.constructorService.prevStep(data);
  }
}
