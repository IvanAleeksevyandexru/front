import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActionType, ScreenButton } from '@epgu/epgu-constructor-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'epgu-cf-ui-screen-container',
  templateUrl: './screen-container.component.html',
  styleUrls: ['./screen-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenContainerComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('show-nav') showNav = true;
  @Input() buttons$: Observable<ScreenButton[]>;
  hiddenPrevButton: ScreenButton;

  ngOnInit(): void {
    this.buttons$?.subscribe((buttons) => {
      this.hiddenPrevButton = buttons.find(
        (button) => button?.attrs?.hidden && button?.type === ActionType.prevStep,
      );
    });
  }
}
