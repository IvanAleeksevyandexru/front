import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
})
export class ConfirmPersonalUserAddressScreenComponent implements OnInit {
  @Input() data: ConfirmAddressInterface;
  @Input() applicantAnswers: object;
  @Output() actionSelect = new EventEmitter();

  constructor(private currentAnswersService: CurrentAnswersService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.currentAnswersService.state = this.data.value;
  }

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'noAddress':
        this.handleDataChange();
        break;
      case 'noAddressAndSubmit':
        this.handleDataChange();
        this.actionSelect.emit(action);
        break;
      default:
        this.actionSelect.emit(action);
        break;
    }
  }

  handleDataChange(
    changes: any = JSON.stringify({
      regDate: this.datePipe.transform(Date.now(), 'dd.MM.yyyy'),
      regAddr: '',
    }),
  ) {
    this.data.value = changes;
    if (changes) {
      this.currentAnswersService.isValid = true;
    }
    this.currentAnswersService.state = changes;
  }
}
