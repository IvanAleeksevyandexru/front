import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton } from 'epgu-constructor-types/dist/base/screen-buttons';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenButtonsComponent {
  @Input() screenButtons: Array<ScreenButton>;
  @Input() isLoading = false;
  @Input() disabled = false;
  @Input() disabledForAll = false;

  public clickedButton: ScreenButton;

  setClickedButton(button: ScreenButton): void {
    this.clickedButton = button;
  }
}
