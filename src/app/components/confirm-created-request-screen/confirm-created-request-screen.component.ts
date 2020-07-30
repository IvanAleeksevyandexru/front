import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimpleComponentInterface} from '../../interfaces/simple-component.interface';

@Component({
  selector: 'app-confirm-created-request-screen',
  templateUrl: './confirm-created-request-screen.component.html',
  styleUrls: ['./confirm-created-request-screen.component.scss']
})
export class ConfirmCreatedRequestScreenComponent implements OnInit {
  @Input() data: SimpleComponentInterface;

  @Output('nextStep') nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
  }

  nextStep() {
    this.nextStepEvent.emit(true);
  }
}
