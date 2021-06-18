import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'epgu-cf-ui-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContainerComponent {
  @Input() showLoader = true;
}
