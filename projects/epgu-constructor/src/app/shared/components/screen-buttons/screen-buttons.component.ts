import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenButton } from '@epgu/epgu-constructor-types';

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
