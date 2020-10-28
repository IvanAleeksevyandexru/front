import { Component, Input } from '@angular/core';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { ScreenTypes } from '../screen.types';

@Component({
  selector: 'epgu-constructor-screen-resolver',
  templateUrl: './screen-resolver.component.html',
  styleUrls: ['./screen-resolver.component.scss'],
})
export class ScreenResolverComponent {
  @Input() playerLoaded = false;
  @Input() set screenType(screenType: ScreenTypes) {
    this.screenComponent = this.getScreenComponentByType(ScreenTypes.INFO);

    if (!this.screenComponent) {
      this.handleScreenComponentError(screenType);
    }
  }

  screenComponent: ScreenComponent;

  getScreenComponentByType(screenType: ScreenTypes) {
    return SCREEN_COMPONENTS[screenType];
  }

  private handleScreenComponentError(screenType: ScreenTypes) {
    // TODO: need to find a better way for handling this error, maybe show it on UI
    throw new Error(`We cant find screen component for this type: ${screenType}`);
  }
}
