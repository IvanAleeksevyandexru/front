import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ScreenService } from '../../../../screen/screen.service';

@Component({
  selector: 'epgu-constructor-page-name',
  templateUrl: './page-name.component.html',
  styleUrls: ['./page-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNameComponent {
  constructor(public screenService: ScreenService) {}
}
