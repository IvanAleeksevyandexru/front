import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as uuid from 'uuid';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';

enum ItemStatus {
  invalid = 'INVALID',
  valid = 'VALID',
}

interface ChildI {
  id?: number | string;
  text?: string;
  [key: string]: any;
}

@Component({
  selector: 'epgu-constructor-select-children-screen',
  templateUrl: './select-children-screen.component.html',
  styleUrls: ['./select-children-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectChildrenScreenComponent implements OnInit {
  @Input() data: ComponentBase;
  @Output() nextStepEvent: EventEmitter<string> = new EventEmitter<string>();

  NEW_ID = 'new';
  valueParsed: any;
  itemsToSelect: Array<ListItem>; // Дети для выпадающего списка
  items: Array<any> = []; // Выбранные дети
  itemsComponents = []; // Компоненты для кастомных детей
  selectChildrenForm = new FormGroup({});
  firstNameRef: string;
  idRef: string;
  isNewRef: string;
  defaultAvailable = 20;

  constructor(
    private currentAnswersService: CurrentAnswersService,
    public screenService: ScreenService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  ngOnInit(): void {
    this.initVariables();
    this.selectChildrenForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.updateCurrentAnswerServiceValidation());

    this.initStartValues();
  }

  initVariables() {
    const component = this.screenService.getCompFromDisplay(this.data.id);
    const itemsList = component ? JSON.parse(component.presetValue) : [];
    this.firstNameRef = this.getRefFromComponent('firstName');
    this.isNewRef = this.getRefFromComponent('isNew');
    this.idRef = this.getRefFromComponent('id');
    this.itemsToSelect = this.getItemsToSelect(itemsList);
  }

  private getItemsToSelect(itemsList) {
    return itemsList
      .map((child) => {
        return {
          ...child,
          id: child[this.idRef],
          text: child[this.firstNameRef],
        };
      })
      .concat(this.getChildForAddChildren(this.idRef));
  }

  private getChildForAddChildren(prop: string) {
    return {
      id: this.NEW_ID,
      text: 'Добавить нового ребенка',
      [prop]: this.NEW_ID,
    };
  }

  initStartValues(): void {
    const cachedValue = this.screenService.getCompValueFromCachedAnswers(this.data.id);
    if (cachedValue) {
      const children = JSON.parse(cachedValue);
      children.forEach((child, index) => {
        const isNew = JSON.parse(child[this.isNewRef]);
        const childId = isNew ? this.NEW_ID : child[this.idRef];
        // По ID получаем ребенка для подстановки в formControl
        const childFromList = this.itemsToSelect.find((item) => item[this.idRef] === childId);
        this.addMoreChild(childFromList, isNew ? child : {});
        this.handleSelect(child, index);
      });
    } else {
      this.addMoreChild();
    }
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

  /**
   * Создание кастомного ребенка
   */
  addNewChild(index: number): void {
    const id = uuid.v4();
    const newChild: any = {
      ...this.screenService.component?.attrs?.components?.reduce(
        (accum, value: any) => ({
          ...accum,
          [value.id]: '',
        }),
        {},
      ),
      [this.isNewRef]: 'true',
      [this.idRef]: id,
    };
    this.handleSelect(newChild, index);
  }

  removeChild(index: number): void {
    const { controlId } = this.items[index];
    this.items.splice(index, 1);
    this.itemsComponents.splice(index, 1);
    this.selectChildrenForm.removeControl(controlId);
    this.passDataToSend(this.items);
  }

  /**
   * Сохраняем данные для отправки, удаляя лишние поля
   */
  passDataToSend(items): void {
    const itemsToSend = items.map((child) => {
      const childToSend = { ...child };
      delete childToSend.controlId;
      delete childToSend.id;
      delete childToSend.text;
      return childToSend;
    });
    this.currentAnswersService.state = itemsToSend;
    this.setHideStateToSelectedItems();
  }

  /**
   * Метод обновляет поля кастомного ребенка
   * @param childData поля-компоненты для заполенения кастомного ребенка
   * @param item сам ребенок
   * @param index индекс массива детей
   */
  updateChild(childData, item, index): void {
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
        [this.idRef]: item[this.idRef],
        [this.isNewRef]: item[this.isNewRef],
      },
    };
    Object.assign(this.items[index], updatedChildData);
    this.passDataToSend(this.items);
  }

  /**
   * метод добавляет нового ребенка в массив и возвращает его
   * @param initValue значальное значение для контрола
   * @param childFromCache ребенок из кэша. Используется для заполнения полей кастомного беренка
   */
  addMoreChild(initValue?: ChildI, childFromCache: ChildI = {}): void {
    const index = this.items.length;
    const controlId = `child_${uuid.v4()}`;
    this.addFormControl(controlId, initValue);
    this.items.push({ controlId });
    this.itemsComponents[index] = this.prepareItemComponents(childFromCache);
  }

  /**
   *
   * @param event объект-ребенок
   * @param index индекс массива детей
   */
  handleSelect(event, index?: number): void {
    Object.assign(this.items[index], event);
    if (event[this.idRef] === this.NEW_ID) {
      this.addNewChild(index);
    } else {
      this.passDataToSend(this.items);
    }
  }

  isScreensAvailable(): boolean {
    const screensAmount = this.items.length;
    const repeatAmount = this.screenService.component?.attrs?.repeatAmount || this.defaultAvailable;

    return screensAmount >= repeatAmount;
  }

  private setHideStateToSelectedItems(): void {
    this.itemsToSelect = this.itemsToSelect.map((child) => {
      // eslint-disable-next-line no-param-reassign
      child.hidden = this.items.some((selectedChild) => {
        return selectedChild[this.idRef] === child[this.idRef];
      });
      return child;
    });
  }

  private addFormControl(id, value = null): void {
    this.selectChildrenForm.addControl(id, new FormControl(value, [Validators.required]));
  }

  /**
   * метод формирует и возвращает массив компонентов кастомного ребенка
   * @param child - сохраненный ранее ребенок. Используется для заполнения полей
   */
  private prepareItemComponents(child = {}) {
    return this.screenService.component?.attrs?.components.map((component) => {
      return {
        ...component,
        value: child[component.id],
      };
    });
  }

  isNewId(itemId: string = 'false'): boolean {
    return JSON.parse(itemId);
  }

  isMoreThanOneChild(): boolean {
    return this.items.length > 1;
  }
}
