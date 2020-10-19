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

    if (!this.data.value) {
      this.currentAnswersService.isValid = false;
    }
  }

  noAddressAction() {
    this.data.value = JSON.stringify({ regDate: '', regAddr: '' });
    this.data = { ...this.data };
  }

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'noAddress':
        this.noAddressAction();
        break;
      case 'noAddressAndSubmit':
        this.noAddressAction();
        this.handleDataChange({ regDate: '', regAddr: '' });
        this.actionSelect.emit(action);
        break;
      default:
        this.actionSelect.emit(action);
        break;
    }
  }

  handleDataChange(changes: any) {
    this.data.value = changes;
    if (changes) {
      this.currentAnswersService.isValid = true;
    } else {
      this.currentAnswersService.isValid = false;
    }
    this.currentAnswersService.state = changes;
  }
}
