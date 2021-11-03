import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'epgu-constructor-swipeable-wrapper',
  templateUrl: './swipeable-wrapper.component.html',
  styleUrls: ['./swipeable-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwipeableWrapperComponent {
  public expanded = false;
}
