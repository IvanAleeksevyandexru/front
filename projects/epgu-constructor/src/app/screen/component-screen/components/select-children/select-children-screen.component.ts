import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as uuid from 'uuid';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../current-answers.service';
import { ScreenService } from '../../../screen.service';
import { ComponentBase } from '../../../screen.types';

@Component({
  selector: 'epgu-constructor-select-children-screen',
  templateUrl: './select-children-screen.component.html',
  styleUrls: ['./select-children-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectChildrenScreenComponent implements OnInit, AfterViewInit {
  @Input() data: ComponentBase;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  valueParsed: any;
  itemsList: any = [];
  itemsToSelect: Array<ListItem>;
  selectedItems: any = {};
  items: Array<string> = [];
  selectChildrenForm = new FormGroup({});
  firstNameRef: string;
  idRef: string;
  isNewRef: string;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnInit(): void {
    this.valueParsed = JSON.parse(this.data.value);
    this.itemsList = this.valueParsed?.items || [];
    this.firstNameRef = this.getRefFromComponent('firstName');
    this.isNewRef = this.getRefFromComponent('isNew');
    this.idRef = this.getRefFromComponent('id');
    this.itemsToSelect = [
      ...this.itemsList.map((child) => {
        return {
          id: child[this.idRef],
          text: child[this.firstNameRef],
        };
      }),
      { id: 'new', text: 'Добавить нового ребенка' },
    ];
    this.selectedItems = {};
    this.passDataToSend(Object.values(this.selectedItems));
    this.selectChildrenForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.items = Object.keys(this.selectChildrenForm.controls);
    });
  }

  ngAfterViewInit(): void {
    this.generateFirstFormItem();
  }

  getRefFromComponent(refName: string): string {
    return (this.screenService.component?.attrs?.components || []).find((item) =>
      item?.attrs?.fields?.find((field) => field.fieldName === refName),
    )?.id;
  }

  addNewChild(item): void {
    const id = item;
    const newChild: any = {
      ...this.screenService.component?.attrs?.components?.reduce((accum, value: any) => {
        // eslint-disable-next-line no-param-reassign
        accum[value.id] = '';
        return accum;
      }, {}),
      [this.isNewRef]: true,
      [this.idRef]: id,
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
    const childItem = this.itemsList.find((value) => value[this.idRef] === item);
    const formattedChildData = Object.keys(childData).reduce((accum, key) => {
      // eslint-disable-next-line no-param-reassign
      accum[key] = childData[key].value;
      return accum;
    }, {});
    const updatedChildData = {
      ...formattedChildData,
      ...{
        [this.idRef]: childItem[this.idRef],
        [this.isNewRef]: childItem[this.isNewRef],
      },
    };
    this.selectChildrenForm.controls[item].setValue(updatedChildData);
    this.selectedItems[item] = updatedChildData;
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
      const selectedChild = this.itemsList.find((child) => child[this.idRef] === id);
      this.selectedItems[item] = selectedChild;
      this.passDataToSend(Object.values(this.selectedItems));
      this.setHideStateToSelectedItems();
    }
  }

  private setHideStateToSelectedItems(): void {
    const selectedItemsKeys: Array<string | number> = Object.values(this.selectedItems).map(
      (selectedItem: any) => selectedItem[this.idRef],
    );
    this.itemsToSelect = this.itemsToSelect.map((item) => {
      const newItem = item;
      newItem.unselectable = false;
      if (selectedItemsKeys.includes(newItem[this.idRef])) {
        newItem.unselectable = true;
      }
      return newItem;
    });
  }

  private generateFirstFormItem(): void {
    const id = uuid.v4();
    this.items.push(id);
    this.addFormControl(id);
  }

  private addFormControl(id): void {
    this.selectChildrenForm.addControl(id, new FormControl());
  }
}
