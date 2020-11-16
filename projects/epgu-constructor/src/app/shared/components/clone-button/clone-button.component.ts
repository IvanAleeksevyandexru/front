import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'epgu-constructor-clone-button',
  templateUrl: './clone-button.component.html',
  styleUrls: ['./clone-button.component.scss'],
})
export class CloneButtonComponent implements OnInit {
  @Input() disabled?: boolean;
  @Output() clickEvent = new EventEmitter<void>();

  ngOnInit(): void {}

  onClick() {
    this.clickEvent.emit();
  }
}
