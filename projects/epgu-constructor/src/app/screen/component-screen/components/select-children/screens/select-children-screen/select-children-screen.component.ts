import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as uuid from 'uuid';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { ComponentBase } from '../../../../../screen.types';
import { ChildItem } from './select-children-screen.type';

@Component({
  selector: 'epgu-constructor-select-children-screen',
  templateUrl: './select-children-screen.component.html',
  styleUrls: ['./select-children-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectChildrenScreenComponent implements OnInit {
  @Input() data: ComponentBase;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  valueParsed: any;
  itemsList: any = [];
  itemsToSelect: Array<ListItem>;
  selectedItems: any = {};
  items: Array<string> = [];
  selectChildrenForm = new FormGroup({});

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    this.itemsList = this.valueParsed?.items || [];
    this.itemsToSelect = [
      ...this.itemsList.map((child) => {
        return {
          id: child.id,
          text: child.firstName,
        };
      }),
      { id: 'new', text: 'Добавить нового ребенка' },
    ];
    this.selectedItems = {};
    this.passDataToSend(Object.values(this.selectedItems));
    this.generateFormGroup();
    this.selectChildrenForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.items = Object.keys(this.selectChildrenForm.controls);
    });
  }

  addNewChild(item): void {
    const id = item;
    const newChild: ChildItem = {
      isNew: true,
      id,
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

    this.selectChildrenForm.controls[item].disable();
    this.itemsList.push(newChild);
    this.handleSelect({ id }, item);
  }

  removeChild(item: string): void {
    this.selectChildrenForm.removeControl(item);
    delete this.selectedItems[item];
    this.passDataToSend(Object.values(this.selectedItems));
    this.setHideStateToSelectedItems();
  }

  passDataToSend(selectedItems): void {
    this.valueParsed.items = selectedItems;
    this.currentAnswersService.state = this.valueParsed;
  }

  updateChild(childData, item): void {
    // augment new child data with data passed from add-new-child-form component
    this.selectChildrenForm.controls[item].setValue(childData);
    this.selectedItems[item] = childData;
    this.passDataToSend(Object.values(this.selectedItems));
    this.setHideStateToSelectedItems();
  }

  addMoreChild(): void {
    this.addFormControl(uuid.v4());
  }

  handleSelect(event, item: string): void {
    const { id } = event;
    if (id === 'new') {
      this.addNewChild(item);
    } else {
      const selectedChild = this.itemsList.find((child) => child.id === id);
      this.selectedItems[item] = selectedChild;
      this.passDataToSend(Object.values(this.selectedItems));
      this.setHideStateToSelectedItems();
    }
  }

  private setHideStateToSelectedItems(): void {
    const selectedItemsKeys: Array<string | number> = Object.values(this.selectedItems).map(
      (selectedItem: any) => selectedItem.id,
    );
    this.itemsToSelect = this.itemsToSelect.map((item) => {
      const newItem = item;
      newItem.unselectable = false;
      if (selectedItemsKeys.includes(newItem.id)) {
        newItem.unselectable = true;
      }
      return newItem;
    });
  }

  private generateFormGroup(): void {
    const id = uuid.v4();
    this.selectChildrenForm.addControl(id, new FormControl());
    this.items.push(id);
  }

  private addFormControl(id): void {
    this.selectChildrenForm.addControl(id, new FormControl());
  }
}
