import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { startWith, takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  ComponentDto,
  ScenarioErrorsDto,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CustomComponentOutputData } from '../../../../../../shared/components/components-list/components-list.types';
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
  @Input() errors: ScenarioErrorsDto;
  @Output() updateCurrentAnswerServiceValidationEvent = new EventEmitter<boolean>();
  @Output() updateCurrentAnswerServiceStateEvent = new EventEmitter<
    { [key: string]: string | number | boolean }[]
  >();
  itemsToSelect: Array<ChildI>; // Дети для выпадающего списка
  items: Array<ChildI> = []; // Выбранные дети
  itemsComponents = []; // Компоненты для кастомных детей
  selectChildrenForm = new FormGroup({});
  firstNameRef: string;
  idRef: string;
  isNewRef: string;
  passportRef: string;
  repeatAmount: number;
  isSingleChild: boolean;
  hint?: string;
  DEFAULT_AVAILABLE = 20;
  NEW_ID = 'new';
  hideAddNewChildButton = false;

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
  ) {}

  ngOnInit(): void {
    this.repeatAmount = this.component?.attrs?.repeatAmount || this.DEFAULT_AVAILABLE;

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
      .on('cloneButtonClickEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => {
        this.addMoreChild();
      });
  }

  initVariables(): void {
    const itemsList = this.component ? JSON.parse(this.component.presetValue || '[]') : [];
    this.hideAddNewChildButton = this.component?.attrs?.hideAddNewChildButton || false;
    this.firstNameRef = this.getRefFromComponent('firstName');
    this.isNewRef = this.getRefFromComponent('isNew');
    this.idRef = this.getRefFromComponent('id');
    this.passportRef = this.getRefFromComponent('rfPasportSeries');
    this.itemsToSelect = this.getItemsToSelect(itemsList);
    this.isSingleChild = this.component?.attrs?.singleChild;
    this.hint = this.component?.attrs?.hint;
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
    } else {
      this.addMoreChild();
    }
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
    this.selectChildrenForm.get(itemId).setValidators([
      Validators.required,
      (): ValidationErrors => {
        return formArray.status === ItemStatus.valid ? null : { invalidForm: true };
      },
    ]);
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
    this.passDataToSend(this.items);
  }

  /**
   * Сохраняем данные для отправки, удаляя лишние поля
   */
  passDataToSend(items: ChildI[], clearEvent?: ClearEvent): void {
    const itemsToSend = items.map((child) => {
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
    this.updateCurrentAnswerServiceStateEvent.emit(itemsToSend);
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
    this.passDataToSend(this.items);
  }

  /**
   * метод добавляет нового ребенка в массив и возвращает его
   * @param initValue значальное значение для контрола
   * @param childFromCache ребенок из кэша. Используется для заполнения полей кастомного беренка
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

    if (event && event[this.idRef] === this.NEW_ID) {
      const newChild = this.createNewChild();
      this.handleSelect(newChild, index);
    } else {
      const clearEvent = {
        isClear: event === null,
        id,
      };
      this.passDataToSend(this.items, clearEvent);
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
  private prepareItemComponents(child: ChildI = {}): Array<ComponentDto> {
    return this.component?.attrs?.components.map((component) => {
      return {
        ...component,
        value: <string>child[component.id],
      };
    });
  }

  private getItemsToSelect(itemsList: Array<{ [key: string]: string }>): ChildI[] {
    const itemsToSelect = itemsList.map<ChildI>((child) => {
      return {
        ...child,
        id: child[this.idRef],
        text: child[this.firstNameRef],
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
      text: 'Добавить нового ребёнка',
      [prop]: this.NEW_ID,
    };
  }
}
