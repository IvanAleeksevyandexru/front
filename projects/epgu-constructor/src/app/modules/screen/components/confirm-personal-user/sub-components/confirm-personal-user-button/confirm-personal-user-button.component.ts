import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-personal-user-button',
  templateUrl: './confirm-personal-user-button.component.html',
  styleUrls: ['./confirm-personal-user-button.component.scss'],
})
export class ConfirmPersonalUserButtonComponent implements OnInit {
  @Input() action: string;
  @Output() tap = new EventEmitter();

  ngOnInit(): void {}

  clickToButton(): void {
    this.tap.emit();
  }
}
