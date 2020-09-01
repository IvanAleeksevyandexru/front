import { Component, ComponentRef, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { SCREEN_TYPE } from '../constant/global';
import { FormPlayerService } from './services/form-player/form-player.service';
import { NextStepEventData, PrevStepEventData } from '../interfaces/step-event-data.interface';
import { ScreenResolverService } from './services/screen-resolver/screen-resolver.service';

@Component({
  selector: 'epgu-constructor-form-player',
  templateUrl: './form-player.component.html',
  styleUrls: ['../styles/index.scss', 'form-player.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormPlayerComponent implements OnInit {
  @HostBinding('class.epgu-form-player') class = true;
  componentRef: ComponentRef<Screen>;
  public readonly constructorComponentType = SCREEN_TYPE;

  screenOutputs = {
    nextStepEvent: (nextStepEventData: NextStepEventData) => this.nextStep(nextStepEventData),
    prevStepEvent: (prevStepEventData: PrevStepEventData) => this.prevStep(prevStepEventData),
  };

  constructor(
    readonly constructorService: FormPlayerService,
    readonly screenResolverService: ScreenResolverService,
  ) {}

  ngOnInit(): void {
    this.constructorService.initData();
  }

  // TODO: remove this to FormPlayerService when finish of splitting app's layers refactor
  get screenComponent() {
    const screenType = this.constructorService.getScreenType();
    const screenComponent = this.screenResolverService.getScreenComponentByType(screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(screenType);
    }

    return screenComponent;
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
