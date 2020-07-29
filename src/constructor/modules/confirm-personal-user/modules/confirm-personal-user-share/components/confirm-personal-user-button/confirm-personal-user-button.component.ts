import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'confirm-personal-user-button',
  templateUrl: './confirm-personal-user-button.component.html',
  styleUrls: ['./confirm-personal-user-button.component.scss']
})
export class ConfirmPersonalUserButtonComponent implements OnInit {

  @Output() tap = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  clickToButton() {
    this.tap.emit();
  }
}
