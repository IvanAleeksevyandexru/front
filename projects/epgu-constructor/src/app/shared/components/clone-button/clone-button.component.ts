import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'epgu-constructor-clone-button',
  templateUrl: './clone-button.component.html',
  styleUrls: ['./clone-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloneButtonComponent {
  @Input() disabled?: boolean;
  @Output() clickEvent = new EventEmitter<void>();

  onClick(): void {
    this.clickEvent.emit();
  }
}
