import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
})
export class ConfirmPersonalUserAddressScreenComponent implements OnInit {
  @Input() data: ConfirmAddressInterface;
  @Input() applicantAnswers: object;
  @Output() actionSelect = new EventEmitter();

  constructor(private currentAnswersService: CurrentAnswersService) {}

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

  handleDataChange(changes: any = JSON.stringify({ regDate: '', regAddr: '' })) {
    this.data.value = changes;
    if (changes) {
      this.currentAnswersService.isValid = true;
    }
    this.currentAnswersService.state = changes;
  }
}
