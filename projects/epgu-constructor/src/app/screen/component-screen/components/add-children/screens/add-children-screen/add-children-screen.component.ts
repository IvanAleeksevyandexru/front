import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as uuid from 'uuid';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { ChildUnder14 } from './add-children-screen.type';
import { ComponentBase } from '../../../../../screen.types';

@Component({
  selector: 'epgu-constructor-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  @Input() data: ComponentBase;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  valueParsed: any;
  itemsList: any = [];
  itemsToSelect: Array<ListItem>;
  selectedItems: any = {};
  items: Array<string> = [];
  addChildrenForm = new FormGroup({});

  constructor(
    private componentStateService: ComponentStateService,
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
    this.addChildrenForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.items = Object.keys(this.addChildrenForm.controls);
    });
  }

  addNewChild(item): void {
    const id = item;
    const newChild: ChildUnder14 = {
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

    this.itemsList.push(newChild);
    this.handleSelect({ id }, item);
  }

  removeChild(item: string): void {
    this.addChildrenForm.removeControl(item);
    delete this.selectedItems[item];
    this.passDataToSend(Object.values(this.selectedItems));
    this.setHideStateToSelectedItems();
  }

  passDataToSend(selectedItems): void {
    this.valueParsed.items = selectedItems;
    this.componentStateService.state = this.valueParsed;
  }

  updateChild(childData, item): void {
    // augment new child data with data passed from add-new-child-form component
    this.addChildrenForm.controls[item].setValue(childData);
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
    this.addChildrenForm.addControl(id, new FormControl());
    this.items.push(id);
  }

  private addFormControl(id): void {
    this.addChildrenForm.addControl(id, new FormControl());
  }
}
