import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ScreenActionDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-screen-buttons',
  templateUrl: './screen-buttons.component.html',
  styleUrls: ['./screen-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenButtonsComponent {
  @Input() screenButtons: Array<ScreenActionDto>;
  @Input() isLoading = false;
  @Input() isValid = true;
  @Input() validateForAll = false;
}
