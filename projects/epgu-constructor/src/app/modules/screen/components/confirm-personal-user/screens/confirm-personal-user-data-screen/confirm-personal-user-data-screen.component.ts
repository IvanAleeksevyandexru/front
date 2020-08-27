import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmUserDataInterface } from '../../../../../../../interfaces/confirm-user-data.interface';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-data-screen',
  templateUrl: './confirm-personal-user-data-screen.component.html',
  styleUrls: ['./confirm-personal-user-data-screen.component.scss'],
})
export class ConfirmPersonalUserDataScreenComponent implements OnInit {
  @Input() data: ConfirmUserDataInterface;
  @Output() actionSelect = new EventEmitter();
  @Output() nextStepEvent: EventEmitter<any> = new EventEmitter<any>();

  clickToAction(action): void {
    this.actionSelect.emit(action);
  }

  nextStep(): void {
    this.nextStepEvent.emit(true);
  }

  ngOnInit(): void {}
}
