import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  OnInit,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { SCREEN_TYPE } from '../constant/global';
import { ConstructorService } from './services/constructor/constructor.service';
import { NextStepEventData } from '../interfaces/step-event-data.interface';
import { ScreenService } from './services/screen/screen.service';

@Component({
  selector: 'epgu-constructor-constructor',
  templateUrl: './constructor.component.html',
  styleUrls: ['../styles/index.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConstructorComponent implements OnInit {
  @HostBinding('class.epgu-form') class = true;
  componentRef: ComponentRef<Screen>;
  public readonly constructorComponentType = SCREEN_TYPE;

  constructor(
    readonly constructorService: ConstructorService,
    readonly screenService: ScreenService,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.constructorService.getData();
  }

  createComponent() {
    const screenType = this.constructorService.getScreenType();
    const screenComponent = this.screenService.getScreenComponentByType(screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(screenType);
    }

    const componentFactory: ComponentFactory<Screen> = this.componentFactoryResolver.resolveComponentFactory(
      screenComponent,
    );
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
  }

  handleScreenComponentError(screenType: string) {
    // TODO: need to find a better way for handling this error, maybe show it on UI
    throw new Error(`We cant find screen component for this type: ${screenType}`);
  }

  nextStep(nextStepEventData?: NextStepEventData) {
    this.constructorService.nextStep(nextStepEventData?.data, nextStepEventData?.options);
  }

  prevStep(data?: any) {
    this.constructorService.prevStep(data);
  }
}
