import { Component, OnInit, Input } from '@angular/core';
import { ConfirmAddressActionsInterface } from '../../../../../screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/interface/confirm-address.interface';

@Component({
  selector: 'epgu-constructor-confirm-child-address',
  templateUrl: './confirm-child-address.component.html',
  styleUrls: ['./confirm-child-address.component.scss'],
})
export class ConfirmChildAddressComponent implements OnInit {
  @Input() data: any;
  @Input() childrenData: any[];
  @Input() userAddress: any;
  @Input() actions: any;
  isEditable: boolean;
  child: any;

  sameAddressAction() {
    this.child.registrationAddress = this.userAddress.registrationAddress;
    this.child.registrationAddressDate = this.userAddress.registrationAddressDate;
    this.actions.handleUpdateChild(this.child);
    const event: ConfirmAddressActionsInterface = {
      action: 'getNextStep',
      value: '',
      label: '',
    };
    this.handleAction(event);
  }

  noAddressAction() {
    this.child.registrationAddress = '';
    this.child.registrationAddressDate = '';
    this.actions.handleUpdateChild(this.child);
    const event: ConfirmAddressActionsInterface = {
      action: 'getNextStep',
      value: '',
      label: '',
    };
    this.handleAction(event);
  }

  changeAddressAction() {
    this.isEditable = true;
  }

  handleAction(event: ConfirmAddressActionsInterface) {
    const { action } = event;
    const srinkSelectedChildrenList = true;
    const stepToReturn = 2;

    this.actions[action](stepToReturn, srinkSelectedChildrenList);
  }

  handleDataChange(event) {
    const { valueParsed } = event;
    this.child.registrationAddress = valueParsed.registrationAddress;
    this.child.registrationAddressDate = valueParsed.registrationAddressDate;
  }

  ngOnInit(): void {
    this.actions = {
      ...this.actions,
      ...{
        sameAddress: this.sameAddressAction.bind(this),
        noAddress: this.noAddressAction.bind(this),
        changeAddress: this.changeAddressAction.bind(this),
      },
    };

    [this.child] = this.childrenData;
    this.data.value = JSON.stringify({
      registrationAddress: this.child.registrationAddress,
      registrationAddressDate: this.child.registrationAddressDate,
    });
  }
}
