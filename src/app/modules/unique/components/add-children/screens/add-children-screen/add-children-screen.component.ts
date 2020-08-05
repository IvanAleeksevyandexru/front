import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { EgpuResponseComponentInterface } from '../../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterface;
  @Input() header: string;
  @Output() nextStepEvent = new EventEmitter();

  sectionId = 1; // variable for 'screen switching' according to sub-components order
  valueParsed: any;
  childrenList: any;
  childrenSelectList: Array<ListItem>;
  selectedChildrenList: any = [];

  headerMapped: any;
  confirmAddressData: any;

  // list of root actions to pass to sub-components providing 'navigation' logic
  actionsList = {
    handleAnswerSelect: this.handleAnswerSelect.bind(this),
    getNextStep: this.nextStep.bind(this),
    getNextScreen: this.getNextScreen.bind(this),
  };

  // constructor() {}

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    this.childrenList = this.valueParsed?.children;
    this.childrenSelectList = this.childrenList.map((child) => {
      return {
        id: child.firstName,
        text: child.firstName,
      };
    });

    this.confirmAddressData = this.data;

    // temporary hardcoded headers for sub-components
    this.headerMapped = {
      1: this.header,
      2: 'Свидетельство о рождении',
      3: `Кем вы приходитесь ребенку? (<span>${this.childrenSelectList[0].text}</span>)`,
      4: `Адрес постоянной регистрации ребенка (<span>${this.childrenSelectList[0].text}</span>)`,
    };
  }

  addNewChild() {
    const newChild = { id: 'new', firstName: '' };
    this.childrenList.push(newChild);
    this.selectedChildrenList.push(newChild);
  }

  removeChild(index) {
    this.childrenSelectList.splice(index, 1);
    this.childrenList.splice(index, 1);
  }

  updateChild(data) {
    // augment new child data with data passed from add-new-child-form component
    const { childData, childIdx } = data;
    this.childrenList[childIdx] = childData;
    this.selectedChildrenList[childIdx] = childData;
  }

  handleSelect(event) {
    const { item } = event;
    this.selectedChildrenList.push(this.childrenList.find((child) => child.firstName === item.id));
  }

  handleAnswerSelect() {
    this.nextStep();
  }

  getNextScreen() {
    this.nextStepEvent.emit();
  }

  nextStep() {
    if (this.selectedChildrenList.length) {
      this.sectionId += 1;
    }
  }
}
