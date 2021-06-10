import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-constructor-default-unique-screen-wrapper',
  templateUrl: './default-unique-screen-wrapper.component.html',
  styleUrls: ['./default-unique-screen-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultUniqueScreenWrapperComponent {
  @Input() showNav: boolean;
  @Input() header: string;
  @Input() screenButtons: Array<ScreenButton>;
  @Input() isLoading: boolean;
  @Input() isValid = true;
}
