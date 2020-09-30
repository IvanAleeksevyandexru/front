import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ToolsService } from '../../../../../../shared/services/tools/tools.service';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
})
export class ConfirmPersonalUserAddressScreenComponent implements OnInit {
  @Input() data: ConfirmAddressInterface;
  @Input() currentCycledFields: object;
  @Input() applicantAnswers: object;
  @Output() actionSelect = new EventEmitter();

  isCycledFields: boolean;
  cycledValues: any;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private toolsService: ToolsService,
  ) {}

  ngOnInit(): void {
    this.isCycledFields = !!Object.keys(this.currentCycledFields).length;
    if (this.isCycledFields) {
      [this.cycledValues] = [
        ...Object.values(this.currentCycledFields).map((value) => JSON.parse(value)),
      ];
      // format state data to {fieldName: value} format
      const data = this.data.attrs.fields.reduce((result, item) => {
        const { fieldName } = item;
        if (!fieldName) return result;

        // eslint-disable-next-line no-param-reassign
        result[fieldName] = this.cycledValues[fieldName];
        return result;
      }, {});
      this.data.value = JSON.stringify(data);
    }
    this.currentAnswersService.state = this.data.value;
  }

  sameAddressAction() {
    const [currentCycledFieldsKey] = Object.keys(this.currentCycledFields);
    const rawValueRef = this.applicantAnswers[currentCycledFieldsKey].value;
    const valueRef = typeof rawValueRef === 'string' ? JSON.parse(rawValueRef) : rawValueRef;
    const { regAddr, regDate } = valueRef;
    this.data.value = JSON.stringify({ regDate, regAddr });
    this.data = { ...this.data };
  }

  noAddressAction() {
    this.data.value = JSON.stringify({ regDate: '', regAddr: '' });
    this.data = { ...this.data };
  }

  clickToAction(event): void {
    const { action } = event;
    switch (action) {
      case 'sameAddress':
        this.sameAddressAction();
        break;
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
    this.currentAnswersService.state = changes;
  }
}
