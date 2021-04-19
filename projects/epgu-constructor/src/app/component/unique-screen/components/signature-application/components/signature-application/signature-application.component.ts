import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentDto } from 'epgu-constructor-types/dist/base/component-dto';
import { ComponentActionDto } from 'epgu-constructor-types/dist/base/component-action-dto';

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
