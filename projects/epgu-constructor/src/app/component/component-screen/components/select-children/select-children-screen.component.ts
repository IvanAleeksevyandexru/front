import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as uuid from 'uuid';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';

enum ItemActions {
  selectChild = 'selectChild',
  removeItem = 'removeItem',
}

enum ItemStatus {
  invalid = 'INVALID',
  valid = 'VALID',
}

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
  itemsToSelect: Array<Partial<ListItem>>;
  selectedItems: { [id: string]: { [ref: string]: any } } = {};
  items: Array<string> = [];
  selectChildrenForm = new FormGroup({});
  firstNameRef: string;
  idRef: string;
  isNewRef: string;
  newChildren: { [id: string]: boolean } = {};
  defaultAvailable = 20;

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
      this.updateCurrentAnswerServiceValidation();
      this.isValidForm();
    });
  }

  ngAfterViewInit(): void {
    this.generateFirstFormItem();
  }

  updateCurrentAnswerServiceValidation(): void {
    this.currentAnswersService.isValid = this.selectChildrenForm.valid && !!this.items.length;
  }

  updateItemValidationStatus(status: ItemStatus, itemId): void {
    const error = status === ItemStatus.valid ? null : { invalidForm: true };
    this.selectChildrenForm.get(itemId).setErrors(error);
    this.updateCurrentAnswerServiceValidation();
  }

  getRefFromComponent(refName: string): string {
    return (this.screenService.component?.attrs?.components || []).find((item) =>
      item?.attrs?.fields?.find((field) => field.fieldName === refName),
    )?.id;
  }

  addNewChild(item): void {
    const id = item;
    const newChild: any = {
      ...this.screenService.component?.attrs?.components?.reduce(
        (accum, value: any) => ({
          ...accum,
          [value.id]: '',
        }),
        {},
      ),
      [this.isNewRef]: true,
      [this.idRef]: id,
    };
    this.newChildren[id] = true;
    this.itemsList.push(newChild);
    this.handleSelect({ id }, item);
  }

  removeChild(item: string): void {
    this.updateItems(ItemActions.removeItem, item);
    this.passDataToSend(Object.values(this.selectedItems));
  }

  passDataToSend(selectedItems): void {
    this.valueParsed.items = selectedItems;
    this.currentAnswersService.state = this.valueParsed;
  }

  updateChild(childData, item): void {
    const childItem = this.itemsList.find((value) => value[this.idRef] === item);
    const formattedChildData = Object.keys(childData).reduce(
      (accum, key) => ({
        ...accum,
        [key]: childData[key].value,
      }),
      {},
    );
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

  handleSelect(event, itemId: string): void {
    const { id } = event;
    if (id === 'new') {
      this.addNewChild(itemId);
    } else {
      this.updateItems(ItemActions.selectChild, itemId, id);
      this.passDataToSend(Object.values(this.selectedItems));
    }
  }

  updateItems(action: ItemActions, itemId: string, childId?: string): void {
    if (action === ItemActions.selectChild && childId) {
      this.selectedItems[itemId] = this.itemsList.find((child) => child[this.idRef] === childId);
    } else if (action === ItemActions.removeItem) {
      this.selectChildrenForm.removeControl(itemId);
      this.newChildren[itemId] = false;
      delete this.selectedItems[itemId];
    }
    this.setHideStateToSelectedItems();
  }

  isScreensAvailable(): boolean {
    const screensAmount = this.items.length;
    const repeatAmount = this.screenService.component?.attrs?.repeatAmount || this.defaultAvailable;

    return screensAmount >= repeatAmount;
  }

  isValidForm() {
    const selectChildrenForm: { [key: string]: string }[] = Object.values(
      this.selectChildrenForm.value,
    );
    this.currentAnswersService.isValid =
      selectChildrenForm.length !== 0 && selectChildrenForm.every((child) => child);
  }

  private setHideStateToSelectedItems(): void {
    const selectedItemsIds = Object.values(this.selectedItems).map(
      (selectedItem: { [ref: string]: any }) => selectedItem[this.idRef],
    );

    this.itemsToSelect = this.itemsToSelect.map((item: ListItem) => {
      // eslint-disable-next-line no-param-reassign
      item.hidden = Boolean(selectedItemsIds.includes(item.id));
      return item;
    });
  }

  private generateFirstFormItem(): void {
    const id = uuid.v4();
    this.items.push(id);
    this.addFormControl(id);
  }

  private addFormControl(id): void {
    this.selectChildrenForm.addControl(id, new FormControl(null, [Validators.required]));
  }
}
