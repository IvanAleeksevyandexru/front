import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { ChildUnder14Interface } from '../../../../../../../interfaces/children.interface';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'epgu-constructor-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  valueParsed: any;
  childrenList: any;
  itemsInitial: any;
  childrenSelectList: Array<ListItem>;
  selectedChildrenList: any = [];

  headerMapped: any;
  confirmAddressData: any;

  addNewChild() {
    const newChild: ChildUnder14Interface = {
      isNew: true,
      id: this.itemsInitial.length + 1,
      isSelected: true,
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
    this.childrenList.push(newChild);
    this.selectedChildrenList.push(newChild);
  }

  removeChild(id) {
    const childIdx1 = this.childrenSelectList.findIndex((child) => child.id === id);
    const childIdx2 = this.childrenList.findIndex((child) => child.id === id);
    if (childIdx1 > -1) {
      this.childrenSelectList.splice(childIdx1, 1);
    }
    if (childIdx2 > -1) {
      this.childrenList.splice(childIdx2, 1);
    }
  }

  updateChild(childData) {
    // augment new child data with data passed from add-new-child-form component
    const childIdx1 = this.childrenList.findIndex((child) => child.id === childData.id);
    const childIdx2 = this.selectedChildrenList.findIndex((child) => child.id === childData.id);
    this.childrenList[childIdx1] = childData;
    this.selectedChildrenList[childIdx2] = childData;
  }

  handleSelect(event) {
    const { id } = event;
    const selectedChild = this.childrenList.find((child) => child.id === id);
    selectedChild.isSelected = true;
    this.selectedChildrenList.push(selectedChild);
  }

  // outter method to send final data to backend
  getNextScreen() {
    this.valueParsed.items = this.childrenList;
    const data = JSON.stringify(this.valueParsed);
    this.nextStepEvent.emit(data);
  }

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    this.itemsInitial = [...this.valueParsed?.items];
    this.childrenList = this.valueParsed?.items;
    this.childrenSelectList = this.childrenList.map((child) => {
      return {
        id: child.id,
        text: child.firstName,
      };
    });
  }
}
