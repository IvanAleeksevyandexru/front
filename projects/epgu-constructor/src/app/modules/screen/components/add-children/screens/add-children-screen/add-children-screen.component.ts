import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { ChildUnder14Interface } from '../../../../../../../interfaces/children.interface';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';

@Component({
  selector: 'epgu-constructor-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  valueParsed: any;
  itemsList: any = [];
  itemsInitialLength: number;
  itemsToSelect: Array<ListItem>;
  selectedItems: any = [];

  headerMapped: any;
  confirmAddressData: any;

  constructor(private screenComponentService: ScreenComponentService) {}

  addNewChild() {
    const newChild: ChildUnder14Interface = {
      isNew: true,
      id: this.itemsInitialLength += 1,
      birthDate: '',
      gender: '',
      firstName: '',
      lastName: '',
      middleName: '',
      rfBirthCertificateSeries: '',
      rfBirthCertificateNumber: '',
      rfBirthCertificateActNumber: '',
      rfBirthCertificateIssueDate: '',
      rfBirthCertificateIssuedBy: '',
      relationshipToChild: '',
      registrationAddress: '',
      registrationAddressDate: '',
    };
    this.itemsList.push(newChild);
    this.selectedItems.push(newChild);
  }

  removeChild(id) {
    const childIdx1 = this.itemsList.findIndex((child) => child.id === id);
    const childIdx2 = this.selectedItems.findIndex((child) => child.id === id);
    if (childIdx1 > -1) {
      this.itemsList.splice(childIdx1, 1);
    }
    if (childIdx2 > -1) {
      this.selectedItems.splice(childIdx2, 1);
    }
  }

  passDataToSend(selectedItems) {
    this.valueParsed.items = selectedItems;
    this.screenComponentService.dataToSend = this.valueParsed;
  }

  updateChild(childData) {
    // augment new child data with data passed from add-new-child-form component
    const childIdx1 = this.itemsList.findIndex((child) => child.id === childData.id);
    const childIdx2 = this.selectedItems.findIndex((child) => child.id === childData.id);
    this.itemsList[childIdx1] = childData;
    this.selectedItems[childIdx2] = childData;
    this.passDataToSend(this.selectedItems);
  }

  handleSelect(event) {
    const { id } = event;
    const selectedChild = this.itemsList.find((child) => child.id === id);
    this.selectedItems.push(selectedChild);
    this.passDataToSend(this.selectedItems);
  }

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    this.itemsInitialLength = this.valueParsed?.items?.length || 0;
    this.itemsList = this.valueParsed?.items || [];
    this.itemsToSelect = this.itemsList.map((child) => {
      return {
        id: child.id,
        text: child.firstName,
      };
    });
    this.selectedItems = [];
    this.passDataToSend(this.selectedItems);
  }
}
