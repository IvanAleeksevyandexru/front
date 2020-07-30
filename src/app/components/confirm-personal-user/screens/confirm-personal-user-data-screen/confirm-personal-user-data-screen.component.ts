import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SimpleComponentInterface } from '../../../../interfaces/simple-component.interface';
import { ConfirmUserDataInterface } from '../../../../interfaces/confirm-user-data.interface';

@Component({
  selector: 'app-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss']
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  @Input() data: SimpleComponentInterface;
  @Input() userData: ConfirmUserDataInterface;
  @Output() actionSelect = new EventEmitter();
  @Output('nextStep') nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }

  nextStep(): void {
    this.nextStepEvent.emit(true);
  }

  ngOnInit(): void {
  }

}
