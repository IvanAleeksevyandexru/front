import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { ChildUnder14Interface } from '../../../../../../../interfaces/children.interface';
import { EgpuResponseComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterface;
  @Input() header: string;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  sectionId = 1; // variable for 'screen switching' according to sub-components order
  valueParsed: any;
  childrenList: any;
  childrenListInitial: any;
  childrenSelectList: Array<ListItem>;
  selectedChildrenList: any = [];

  headerMapped: any;
  confirmAddressData: any;

  // list of root actions to pass to sub-components providing 'navigation' logic
  actionsList = {
    handleAnswerSelect: this.handleAnswerSelect.bind(this),
    getNextStep: this.nextStep.bind(this),
    getNextScreen: this.getNextScreen.bind(this),
    handleUpdateChild: this.updateChild.bind(this),
  };

  addNewChild() {
    const newChild: ChildUnder14Interface = {
      isNew: true,
      id: this.childrenListInitial.length + 1,
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

  handleAnswerSelect(event) {
    const { value } = event;
    this.selectedChildrenList[0].relationshipToChild = value;
    this.nextStep();
  }

  // outter method to send final data to backend
  getNextScreen() {
    this.valueParsed.items = this.childrenList;
    const data = JSON.stringify(this.valueParsed);
    this.nextStepEvent.emit(data);
  }

  // inner method to show next sub-component (screen-type)
  nextStep(step?, srinkSelectedChildrenList?) {
    if (srinkSelectedChildrenList) {
      this.selectedChildrenList.shift();
      if (!this.selectedChildrenList.length) {
        this.getNextScreen();
        return;
      }
    }

    this.headerMapped[3] = `Кем вы приходитесь ребенку? (<span>${this.selectedChildrenList[0]?.firstName}</span>)`;
    this.headerMapped[4] = `Адрес постоянной регистрации ребенка (<span>${this.selectedChildrenList[0]?.firstName}</span>)`;
    this.sectionId = step || this.sectionId + 1;
  }

  ngOnInit(): void {
    // temporary hardcoded headers for sub-components
    this.headerMapped = {
      1: this.header,
      2: 'Свидетельство о рождении',
      3: `Кем вы приходитесь ребенку? (<span>${this.selectedChildrenList[0]?.firstName}</span>)`,
      4: `Адрес постоянной регистрации ребенка (<span>${this.selectedChildrenList[0]?.firstName}</span>)`,
    };

    this.valueParsed = JSON.parse(this.data.value);
    this.childrenListInitial = [...this.valueParsed?.items];
    this.childrenList = this.valueParsed?.items;
    this.childrenSelectList = this.childrenList.map((child) => {
      return {
        id: child.id,
        text: child.firstName,
      };
    });
  }
}
