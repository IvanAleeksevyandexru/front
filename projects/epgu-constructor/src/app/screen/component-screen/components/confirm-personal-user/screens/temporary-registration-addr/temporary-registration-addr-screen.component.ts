import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemporaryRegistrationComponent } from './temporary-registration-addr-screen.types';
import { CurrentAnswersService } from '../../../../../current-answers.service';

@Component({
  selector: 'epgu-constructor-temporary-registration-addr-screen',
  templateUrl: './temporary-registration-addr-screen.component.html',
  styleUrls: ['./temporary-registration-addr-screen.component.scss'],
})
export class TemporaryRegistrationAddrScreenComponent {
  @Input() data: TemporaryRegistrationComponent;
  @Input() errors: object;
  @Output() actionSelect = new EventEmitter();

  constructor(private currentAnswersService: CurrentAnswersService) {}

  // TODO: Temporary solution, waiting for joining address components
  clickToAction(event): void {
    const { action } = event;
    switch (action) {
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

  noAddressAction() {
    this.data.value = JSON.stringify({ regDate: '', regAddr: '' });
    this.data = { ...this.data };
  }
  handleDataChange(changes: any) {
    this.data.value = changes;
    this.currentAnswersService.state = changes;
  }
}
