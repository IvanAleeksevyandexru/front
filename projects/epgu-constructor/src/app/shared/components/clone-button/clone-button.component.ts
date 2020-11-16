import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'epgu-constructor-clone-button',
  templateUrl: './clone-button.component.html',
  styleUrls: ['./clone-button.component.scss'],
})
export class CloneButtonComponent {
  @Input() disabled?: boolean;
  @Output() clickEvent = new EventEmitter<void>();

  onClick() {
    this.clickEvent.emit();
  }
}
