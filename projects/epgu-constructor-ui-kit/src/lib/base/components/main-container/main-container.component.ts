import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Trobber } from '@epgu/epgu-constructor-types';

@Component({
  selector: 'epgu-cf-ui-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContainerComponent {
  @Input() showLoader = true;
  @Input() trobber: Trobber = { message: '' };
}
