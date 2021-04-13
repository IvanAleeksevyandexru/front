import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ScreenActionDto } from '../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-default-unique-screen-wrapper',
  templateUrl: './default-unique-screen-wrapper.component.html',
  styleUrls: ['./default-unique-screen-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultUniqueScreenWrapperComponent {
  @Input() showNav: boolean;
  @Input() header: string;
  @Input() screenButtons: Array<ScreenActionDto>;
  @Input() isLoading: boolean;
  @Input() isValid = true;
}
