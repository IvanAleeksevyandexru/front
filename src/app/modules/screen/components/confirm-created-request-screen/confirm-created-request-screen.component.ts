import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-created-request-screen',
  templateUrl: './confirm-created-request-screen.component.html',
  styleUrls: ['./confirm-created-request-screen.component.scss'],
})
export class ConfirmCreatedRequestScreenComponent implements OnInit {
  @Input() data;
  @Output() nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {}

  nextStep() {
    this.nextStepEvent.emit(true);
  }
}
