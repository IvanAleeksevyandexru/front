import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SCREEN_COMPONENTS, ScreenComponent } from '../screen.const';
import { ScreenTypes } from '../screen.types';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-screen-resolver',
  templateUrl: './screen-resolver.component.html',
  styleUrls: ['./screen-resolver.component.scss'],
  providers: [UnsubscribeService],
})
export class ScreenResolverComponent implements OnInit {
  screenComponent: ScreenComponent;

  constructor(private screenService: ScreenService, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.screenService.screenType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((screenType) => {
      this.setScreenComponent(screenType);
    });
  }

  setScreenComponent(screenType: ScreenTypes) {
    this.screenComponent = this.getScreenComponentByType(screenType);

    if (!this.screenComponent) {
      this.handleScreenComponentError(screenType);
    }
  }

  getScreenComponentByType(screenType: ScreenTypes) {
    return SCREEN_COMPONENTS[screenType];
  }

  private handleScreenComponentError(screenType: ScreenTypes) {
    // TODO: need to find a better way for handling this error, maybe show it on UI
    throw new Error(`We cant find screen component for this screen type: ${screenType}`);
  }
}
