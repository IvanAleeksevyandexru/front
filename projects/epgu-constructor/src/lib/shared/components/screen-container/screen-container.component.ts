import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-constructor-screen-container',
  templateUrl: './screen-container.component.html',
  styleUrls: ['./screen-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenContainerComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('show-nav') showNav = true;
}
