import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfirmEmailInterface} from "../../../../interfaces/confirm-email.interface";

@Component({
  selector: 'confirm-personal-user-email-screen',
  templateUrl: './confirm-personal-user-email-screen.component.html',
  styleUrls: ['./confirm-personal-user-email-screen.component.scss']
})
export class ConfirmPersonalUserEmailScreenComponent implements OnInit {

  @Input() data: ConfirmEmailInterface;
  @Output() actionSelect = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  clickToAction(action) {
    this.actionSelect.emit(action)
  }
}
