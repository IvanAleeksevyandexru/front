import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ComponentActionDto,
  ComponentDto,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-signature-application',
  templateUrl: './signature-application.component.html',
  styleUrls: ['./signature-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureApplicationComponent {
  @Input() isMobile: boolean;
  @Input() showNav: boolean;
  @Input() header: string;
  @Input() component: ComponentDto;
  @Input() isLoading: boolean;
  @Input() buttons: ComponentActionDto[];

  @Output() next = new EventEmitter<null>();

  nextAction(): void {
    this.next.emit();
  }
}
