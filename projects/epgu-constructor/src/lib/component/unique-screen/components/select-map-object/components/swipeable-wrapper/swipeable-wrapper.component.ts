import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';

@Component({
  selector: 'epgu-constructor-swipeable-wrapper',
  templateUrl: './swipeable-wrapper.component.html',
  styleUrls: ['./swipeable-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwipeableWrapperComponent {
  public expanded = false;

  constructor(public config: ConfigService) {}
}
