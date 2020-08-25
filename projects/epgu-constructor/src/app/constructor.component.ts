import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { COMPONENT_TYPE } from '../constant/global';
import { ConstructorService } from './services/constructor/constructor.service';

@Component({
  selector: 'app-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['./constructor.component.scss', '../styles/index.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConstructorComponent implements OnInit {
  @HostBinding('class.epgu-form') class = true;
  public readonly constructorComponentType = COMPONENT_TYPE;

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
