import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { ChildUnder14Interface } from '../../../../../../../interfaces/children.interface';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ComponentStateService } from '../../../../../../services/component-state/component-state.service';

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
  itemsSelectedQueue: any = [];
  itemsInitialLength: number;
  itemsToSelect: Array<ListItem>;
  itemsToSelectInitial: Array<ListItem>;
  selectedItems: any = {};

  headerMapped: any;
  confirmAddressData: any;

  constructor(
    private componentStateService: ComponentStateService,
    private changeDetection: ChangeDetectorRef,
  ) {}

  addNewChild(idx): void {
    const id = this.itemsInitialLength + 1;
    const newChild: ChildUnder14Interface = {
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
    this.handleSelect({ id }, idx);
  }

  removeChild(id): void {
    const childIdx1 = this.itemsSelectedQueue.findIndex((child) => child.id === id);
    const childIdx2 = Object.values(this.selectedItems).findIndex((child: any) => child.id === id);
    if (childIdx1 > -1) {
      this.itemsSelectedQueue.splice(childIdx1, 1);
    }
    if (childIdx2 > -1) {
      delete this.selectedItems[childIdx2];
    }
    this.passDataToSend(Object.values(this.selectedItems));
    this.setHideStateToSelectedItems();
  }

  passDataToSend(selectedItems): void {
    this.valueParsed.items = selectedItems;
    this.componentStateService.state = this.valueParsed;
  }

  updateChild(childData): void {
    // augment new child data with data passed from add-new-child-form component
    const childIdx = Object.values(this.selectedItems).findIndex(
      (child: any) => child.id === childData.id,
    );
    this.selectedItems[childIdx] = childData;
    this.passDataToSend(Object.values(this.selectedItems));
    this.setHideStateToSelectedItems();
  }

  addMoreChild(): void {
    this.itemsSelectedQueue.push(this.itemsList[0]);
  }

  handleSelect(event, idx: number): void {
    const { id } = event;
    if (id === 'new') {
      this.addNewChild(idx);
    } else {
      const selectedChild = this.itemsList.find((child) => child.id === id);
      this.selectedItems[idx] = selectedChild;
      this.itemsSelectedQueue[idx] = selectedChild;
      this.passDataToSend(Object.values(this.selectedItems));
      this.setHideStateToSelectedItems();
    }
  }

  private setHideStateToSelectedItems(): void {
    this.itemsToSelect.forEach((item) => {
      const selectedItemsKeys: Array<string | number> = Object.values(this.selectedItems).map(
        (selectedItem: any) => selectedItem.id,
      );
      if (selectedItemsKeys.includes(item.id)) {
        // eslint-disable-next-line no-param-reassign
        // item.hidden = true;
      }
    });
  }

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    this.itemsInitialLength = this.valueParsed?.items?.length || 0;
    this.itemsList = this.valueParsed?.items || [];
    this.itemsSelectedQueue.push(this.itemsList[0] || {});
    this.itemsToSelect = [
      ...this.itemsList.map((child) => {
        return {
          id: child.id,
          text: child.firstName,
        };
      }),
      { id: 'new', text: 'Добавить нового ребенка' },
    ];
    this.itemsToSelectInitial = [...this.itemsToSelect];
    this.selectedItems = {};
    this.passDataToSend(Object.values(this.selectedItems));
  }
}
