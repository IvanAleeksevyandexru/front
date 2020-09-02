import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormPlayerService } from '../../../../../../services/form-player/form-player.service';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';
import { ConfirmAddressInterface } from './interface/confirm-address.interface';

@Component({
  selector: 'epgu-constructor-confirm-personal-user-address-screen',
  templateUrl: './confirm-personal-user-address-screen.component.html',
})
export class ConfirmPersonalUserAddressScreenComponent implements OnInit {
  @Input() data: ConfirmAddressInterface;
  @Input() errors: object;
  @Output() actionSelect = new EventEmitter();
  isEditable: boolean;
  dataToSend: any;
  isCycledFields: boolean;
  cycledValues: any;
  currentCycledFields: object;

  constructor(
    private componentStateService: ComponentStateService,
    public constructorService: FormPlayerService,
  ) {}

  ngOnInit(): void {
    this.currentCycledFields = this.constructorService.response?.scenarioDto?.currentCycledFields;
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
    this.dataToSend = this.data.value;
    this.componentStateService.state = this.dataToSend;
  }

  sameAddressAction() {
    const [currentCycledFieldsKey] = Object.keys(this.currentCycledFields);
    const rawValueRef = this.constructorService.response.scenarioDto.applicantAnswers[
      currentCycledFieldsKey
    ].value;
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
      case 'editUserRegAddr':
        this.isEditable = true;
        break;
      case 'sameAddress':
        this.sameAddressAction();
        break;
      case 'noAddress':
        this.noAddressAction();
        break;
      default:
        this.actionSelect.emit(action);
        break;
    }
  }

  setState(changes) {
    let stateData: any;
    if (this.isCycledFields) {
      stateData = {};
      // take currentCycledFields object first key
      const [currentCycledFieldsKey] = Object.keys(
        this.constructorService.response?.scenarioDto?.currentCycledFields,
      );
      // flat cycledValues
      const cycledValuesPrepared = { ...this.cycledValues };
      // merge cycledValue data and state data, which could be updated
      const changesPrepared = JSON.parse(changes);
      const data = { ...cycledValuesPrepared, ...changesPrepared };
      stateData[currentCycledFieldsKey] = {
        visited: true,
        value: JSON.stringify(data),
      };
    } else {
      stateData = changes;
    }
    this.data.value = changes;
    return stateData;
  }

  dataChange(changes: any) {
    const responseData = this.setState(changes);
    this.componentStateService.state = responseData;
  }
}
