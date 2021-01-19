import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  ComponentActionDto,
  ScreenActionDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-component-wrapper',
  templateUrl: './component-wrapper.component.html',
  styleUrls: ['./component-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentWrapperComponent {
  @Input() showNav: boolean;
  @Input() header: string;
  @Input() screenActionButtons: Array<ScreenActionDto>;
  @Input() isShowActionBtn: boolean;
  @Input() actionButtons: ComponentActionDto[];
  @Input() isLoading: boolean;
  @Input() isValid: boolean;
  @Input() nextStepAction: ComponentActionDto;
  @Input() submitLabel: string;
}
