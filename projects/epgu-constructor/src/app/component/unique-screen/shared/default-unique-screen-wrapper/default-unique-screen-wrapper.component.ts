import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton } from 'epgu-constructor-types/dist/base/screen-buttons';

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
