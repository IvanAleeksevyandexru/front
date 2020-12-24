import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ComponentActionDto,
  ComponentDto,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-signature-application-container',
  templateUrl: './signature-application-container.component.html',
  styleUrls: ['./signature-application-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignatureApplicationContainerComponent {
  @Input() isMobile: boolean;
  @Input() showNav$: Observable<boolean>;
  @Input() header$: Observable<string>;
  @Input() component$: Observable<ComponentDto>;
  @Input() isLoading$: Observable<boolean>;
  @Input() actions$: Observable<ComponentActionDto[]>;

  @Output() next = new EventEmitter<null>();

  nextAction(): void {
    this.next.emit();
  }
}
