import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentDto, ComponentActionDto } from 'epgu-constructor-types';

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
