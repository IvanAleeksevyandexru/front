import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { ScreenTypes } from '../screen.types';
import { ScreenService } from '../screen.service';

@Component({
  selector: 'epgu-constructor-screen-resolver',
  templateUrl: './screen-resolver.component.html',
  styleUrls: ['./screen-resolver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenResolverComponent {
  screenComponent$: Observable<ScreenComponent> = this.screenService.screenType$.pipe(
    map((screenType) => {
      return this.setScreenComponent(screenType);
    }),
  );

  constructor(
    private screenService: ScreenService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  setScreenComponent(screenType: ScreenTypes): ScreenComponent {
    const screenComponent = this.getScreenComponentByType(screenType);

    if (!screenComponent) {
      this.handleScreenComponentError(screenType);
    }

    return screenComponent;
  }

  getScreenComponentByType(screenType: ScreenTypes): ScreenComponent {
    return SCREEN_COMPONENTS[screenType];
  }

  private handleScreenComponentError(screenType: ScreenTypes): never {
    throw new Error(`We cant find screen component for this screen type: ${screenType}`);
  }
}
