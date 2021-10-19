import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { get } from 'lodash';
import {
  ScenarioErrorsDto,
  ComponentDto,
  ChildrenListAgeView,
  DisclaimerDto,
} from '@epgu/epgu-constructor-types';
import {
  BusEventType,
  DATE_STRING_DOT_FORMAT,
  EventBusService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { PluralizePipe } from '@epgu/ui/pipes';
import { differenceInCalendarMonths, differenceInCalendarYears, format } from 'date-fns';
import { CustomComponentOutputData } from '../../../../../custom-screen/components-list.types';
import { CachedValue, ChildI, ClearEvent, ItemStatus } from '../../select-children.models';

@Component({
  selector: 'epgu-constructor-select-children',
  templateUrl: './select-children.component.html',
  styleUrls: ['./select-children.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectChildrenComponent implements OnInit {
  @Input() addSectionLabel: string;
  @Input() cachedValue: CachedValue;
  @Input() component: ComponentDto;
  @Input() errors: ScenarioErrorsDto[];
  @Output() updateCurrentAnswerServiceValidationEvent = new EventEmitter<boolean>();

  itemsToSelect: ChildI[]; // Дети для выпадающего списка
  items: ChildI[] = []; // Выбранные дети
  itemsComponents = []; // Компоненты для кастомных детей
  selectChildrenForm = new FormGroup({});
  firstNameRef: string;
  lastNameRef: string;
  birthDateRef: string;
  idRef: string;
  isNewRef: string;
  passportRef: string;
  repeatAmount: number;
  isSingleChild: boolean;
  hint?: string;
  DEFAULT_AVAILABLE = 20;
  NEW_ID = 'new';
  hideAddNewChildButton = false;
  expandAllChildrenBlocks: boolean;
  isObliged: boolean;
  fullNameInList: boolean;
  fullNameListAge: ChildrenListAgeView;
  defaultNewList: string;
  disclaimer: DisclaimerDto;

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
  ) {}

  ngOnInit(): void {
    this.initVariables();
    this.initStartValues();

    this.selectChildrenForm.valueChanges
      .pipe(startWith(this.selectChildrenForm.value), takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        if (this.selectChildrenForm.valid) {
          this.selectChildrenForm.setErrors(null);
        }
        this.updateCurrentAnswerServiceValidation();
      });

    this.eventBusService
      .on(BusEventType.CloneButtonClickEvent)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.addMoreChild();
      });
  }

  initVariables(): void {
    this.fullNameInList = this.component?.attrs?.fullNameInList || false;
    this.defaultNewList = this.component?.attrs?.defaultNewList || 'Добавить нового ребёнка';
    this.fullNameListAge = this.component?.attrs?.fullNameListAge || null;
    this.repeatAmount = this.component?.attrs?.repeatAmount || this.DEFAULT_AVAILABLE;
    this.expandAllChildrenBlocks = this.component?.attrs?.expandAllChildrenBlocks;
    const itemsList = this.component ? JSON.parse(this.component.presetValue || '[]') : [];
    this.hideAddNewChildButton = this.component?.attrs?.hideAddNewChildButton || false;
    this.firstNameRef = this.getRefFromComponent('firstName');
    this.lastNameRef = this.getRefFromComponent('lastName');
    this.birthDateRef = this.getRefFromComponent('birthDate');
    this.isNewRef = this.getRefFromComponent('isNew');
    this.idRef = this.getRefFromComponent('id');
    this.passportRef = this.getRefFromComponent('rfPasportSeries');
    this.itemsToSelect = this.getItemsToSelect(itemsList);
    this.isSingleChild = this.component?.attrs?.singleChild;
    this.hint = this.component?.attrs?.hint;
    this.isObliged = this.component?.attrs?.obliged;
    this.disclaimer = this.component?.attrs?.uniqueBy?.disclaimer;
  }

  initStartValues(): void {
    if (this.cachedValue) {
      this.cachedValue.forEach((child, index) => {
        const isNew = child[this.isNewRef] && JSON.parse(child[this.isNewRef]);
        const childId = isNew ? this.NEW_ID : child[this.idRef];
        // По ID получаем ребенка для подстановки в formControl
        const childFromList = this.itemsToSelect.find((item) => item[this.idRef] === childId);
        this.addMoreChild(childFromList, isNew ? child : {});
        this.handleSelect(child, index);
      });

      return;
    }

    /**
     * При attrs.obliged === true:
     * если ребёнок только один - он выбирается автоматически
     * если детей нет - открывается форма кастомного ребёнка
     */
    if (this.checkObligedConditions()) {
      this.addMoreChild(this.itemsToSelect[0]);
      this.handleSelect(this.itemsToSelect[0], 0);
      return;
    }

    if (this.expandAllChildrenBlocks && this.itemsToSelect.length > 1) {
      this.initAllChildrenBlocks();
    } else {
      this.addMoreChild();
    }
  }

  initAllChildrenBlocks(): void {
    this.itemsToSelect
      .filter((child) => child.id !== 'new')
      .forEach((child, index) => {
        this.addMoreChild(child);
        this.handleSelect(child, index);
      });
  }

  updateCurrentAnswerServiceValidation(): void {
    this.updateCurrentAnswerServiceValidationEvent.emit(
      this.selectChildrenForm.valid && !!this.items.length,
    );
  }

  updateItemValueAndValidity(itemId: string): void {
    this.selectChildrenForm.get(itemId).updateValueAndValidity();
    this.updateCurrentAnswerServiceValidation();
  }

  updateItemValidators(formArray: FormArray, itemId: string): void {
    this.selectChildrenForm
      .get(itemId)
      .setValidators([Validators.required, this.childValidatorsFn(formArray)]);
    this.selectChildrenForm.updateValueAndValidity();
  }

  getRefFromComponent(refName: string): string {
    return (this.component?.attrs?.components || []).find((item) =>
      item?.attrs?.fields?.find((field) => field.fieldName === refName),
    )?.id;
  }

  /**
   * Создание кастомного ребенка
   */
  createNewChild(): ChildI {
    const id = uuidv4();

    return {
      ...this.component?.attrs?.components?.reduce(
        (accum, value) => ({
          ...accum,
          [value.id]: '',
        }),
        {},
      ),
      [this.isNewRef]: 'true',
      [this.idRef]: id,
    };
  }

  removeChild(index: number): void {
    const { controlId } = this.items[index];
    const formStatus = this.selectChildrenForm.status;

    this.items.splice(index, 1);
    this.itemsComponents.splice(index, 1);
    this.selectChildrenForm.removeControl(controlId);
    if (formStatus === ItemStatus.invalid) {
      this.selectChildrenForm.setErrors({ invalidForm: true });
    }

    this.passDataToSend(this.items, index);
    this.eventBusService.emit(BusEventType.DeleteCachedValueItem, {
      index,
    });
  }

  /**
   * Сохраняем данные для отправки, удаляя лишние поля
   */
  passDataToSend(items: ChildI[], index: number, clearEvent?: ClearEvent): void {
    const itemsToSend: { [key: string]: string | number | boolean }[] = items.map((child) => {
      const childToSend = { ...child };
      delete childToSend.controlId;
      delete childToSend.id;
      delete childToSend.text;
      delete childToSend.hidden;
      if (!childToSend[this.isNewRef]) {
        delete childToSend[this.passportRef];
      }
      return childToSend;
    });
    this.eventBusService.emit(BusEventType.UpdateCurrentAnswerServiceStateEvent, {
      state: itemsToSend,
      index,
    });
    this.setHideStateToSelectedItems(clearEvent);
  }

  /**
   * Метод обновляет поля кастомного ребенка
   * @param childData поля-компоненты для заполенения кастомного ребенка
   * @param item сам ребенок
   * @param index индекс массива детей
   */
  updateChild(childData: CustomComponentOutputData, item: ChildI, index: number): void {
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
    this.passDataToSend(this.items, index);
  }

  /**
   * метод добавляет нового ребенка в массив выбранных
   * @param initValue значальное значение для контрола
   * @param childFromCache ребенок из кэша. Используется для заполнения полей кастомного ребенка
   */
  addMoreChild(initValue?: ChildI, childFromCache: ChildI = {}): void {
    const index = this.items.length;
    const controlId = `child_${uuidv4()}`;
    this.addFormControl(controlId, initValue);
    this.items.push({ controlId });
    this.itemsComponents[index] = this.prepareItemComponents(childFromCache);
  }

  /**
   *
   * @param event объект-ребенок
   * @param index индекс массива детей
   * @param id индекс ребенка
   */
  handleSelect(event: ChildI | null, index?: number, id?: string): void {
    this.items[index] = {
      controlId: this.items[index].controlId,
      isNewRef: this.items[index].isNewRef,
      ...event,
    };

    if (!event && index !== undefined) {
      this.eventBusService.emit(BusEventType.DeleteCachedValueItem, {
        index,
      });
    }

    if (event && event[this.idRef] === this.NEW_ID) {
      const newChild = this.createNewChild();
      this.handleSelect(newChild, index);
    } else {
      const clearEvent = {
        isClear: event === null,
        id,
      };
      this.passDataToSend(this.items, index, clearEvent);
    }
  }

  private setHideStateToSelectedItems(clearEvent?: ClearEvent): void {
    this.itemsToSelect = this.itemsToSelect.map((child) => {
      // eslint-disable-next-line no-param-reassign
      child.hidden = this.items.some((selectedChild) => {
        const isSelectChild = selectedChild[this.idRef] === child[this.idRef];
        const isNeedToHidden =
          isSelectChild && clearEvent?.isClear && selectedChild.controlId === clearEvent?.id;

        return isNeedToHidden ? false : isSelectChild;
      });

      return child;
    });
  }

  private addFormControl(id: string, value: ChildI = null): void {
    this.selectChildrenForm.addControl(id, new FormControl(value, [Validators.required]));
  }

  /**
   * метод формирует и возвращает массив компонентов кастомного ребенка
   * @param child - сохраненный ранее ребенок. Используется для заполнения полей
   */
  private prepareItemComponents(child: ChildI = {}): ComponentDto[] {
    return this.component?.attrs?.components.map((component) => {
      return {
        ...component,
        value: <string>child[component.id],
      };
    });
  }

  private getChildName(item: ChildI): string {
    let result = this.fullNameInList
      ? `${item[this.firstNameRef]} ${item[this.lastNameRef]}`
      : item[this.firstNameRef];

    let birthDate = item[this.birthDateRef];
    if (this.fullNameListAge && birthDate?.length > 0) {
      if (this.fullNameListAge === 'age') {
        const pipe = new PluralizePipe();
        const age = differenceInCalendarYears(new Date(), new Date(birthDate));
        if (age === 0) {
          const months = differenceInCalendarMonths(new Date(), new Date(birthDate));
          birthDate = `${months} ${pipe.transform(['месяц', 'месяца', 'месяцев'], months)}`;
        } else {
          birthDate = `${age} ${pipe.transform(['год', 'года', 'лет'], age)}`;
        }
      } else {
        birthDate = format(new Date(birthDate), DATE_STRING_DOT_FORMAT);
      }

      result = `<div class="children-list-item"><div class="full-name-item">${result}</div><div class="date-item">${birthDate}</div></div>`;
    }

    return result;
  }

  private getItemsToSelect(itemsList: { [key: string]: string }[]): ChildI[] {
    const itemsToSelect = itemsList.map<ChildI>((child) => {
      return {
        ...child,
        id: child[this.idRef],
        text: this.getChildName(child),
      };
    });

    if (this.hideAddNewChildButton) {
      return itemsToSelect;
    }

    return this.appendAddNewChildButton(itemsToSelect);
  }

  private appendAddNewChildButton(itemsToSelect: ChildI[]): ChildI[] {
    return itemsToSelect.concat(this.getChildForAddNewChildButton(this.idRef));
  }

  private getChildForAddNewChildButton(prop: string): ChildI {
    return {
      id: this.NEW_ID,
      text: this.defaultNewList,
      [prop]: this.NEW_ID,
    };
  }

  private childValidatorsFn(formArray: FormArray): ValidatorFn {
    return (control: ChildI): ValidationErrors => {
      const isValid =
        get(control.value, this.isNewRef) === false || formArray.status === ItemStatus.valid;
      if (isValid) {
        return null;
      }
      return { invalidForm: true };
    };
  }

  private checkObligedConditions(): boolean {
    return (
      this.isObliged &&
      (this.itemsToSelect.filter((child) => child.id !== 'new').length === 1 ||
        (this.itemsToSelect.length === 1 && this.itemsToSelect[0].id === this.NEW_ID))
    );
  }
}
