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
  @Input() button$: Observable<ScreenButton>;
  hiddenPrevButton: ScreenButton;

  ngOnInit(): void {
    this.button$?.subscribe((button) => {
      if (button?.hidden && button?.type === ActionType.prevStep) {
        this.hiddenPrevButton = button;
      }
    });
  }
}
