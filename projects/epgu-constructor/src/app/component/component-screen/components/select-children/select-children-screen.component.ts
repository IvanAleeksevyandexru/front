import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuidv4 } from 'uuid';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../form-player/services/event-bus/event-bus.service';
import { ComponentDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase, ScreenStoreComponentDtoI } from '../../../../screen/screen.types';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { CustomComponentOutputData } from '../../../components-list/components-list.types';

enum ItemStatus {
  invalid = 'INVALID',
  valid = 'VALID',
}

interface ChildI extends Partial<ListElement> {
  controlId?: string;
  isNewRef?: string;
}

interface ClearEvent {
  isClear: boolean;
  id?: string;
}

@Component({
  selector: 'epgu-constructor-select-children-screen',
  templateUrl: './select-children-screen.component.html',
  styleUrls: ['./select-children-screen.component.scss'],
  providers: [UnsubscribeService],
})
export class SelectChildrenScreenComponent implements OnInit {
  addSectionLabel$ = this.screenService.componentLabel$.pipe(
    map((label) => {
      return label || 'Добавить ребенка';
    }),
  );

  data$: Observable<ComponentBase> = this.screenService.component$;
  NEW_ID = 'new';
  itemsToSelect: Array<ChildI>; // Дети для выпадающего списка
  items: Array<ChildI> = []; // Выбранные дети
  itemsComponents = []; // Компоненты для кастомных детей
  selectChildrenForm = new FormGroup({});
  firstNameRef: string;
  idRef: string;
  isNewRef: string;
  passportRef: string;
  defaultAvailable = 20;
  isSingleChild: boolean;
  hint: string | undefined;

  private component: ScreenStoreComponentDtoI;

  constructor(
    public screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cachedAnswersService: CachedAnswersService,
  ) {}

  ngOnInit(): void {
    this.data$
      .pipe(takeUntil(this.ngUnsubscribe$), takeUntil(this.screenService.isNextScreen$))
      .subscribe((data) => {
        this.initVariables(data.id);
        this.initStartValues(data.id);
      });

    this.selectChildrenForm.valueChanges
      .pipe(startWith(this.selectChildrenForm.value as object), takeUntil(this.ngUnsubscribe$))
      .subscribe(() =>
        setTimeout(() => {
          if (
            Object.keys(this.selectChildrenForm.controls).every((control) => {
              return this.selectChildrenForm.controls[control].valid;
            })
          ) {
            this.selectChildrenForm.setErrors(null);
          }
          this.updateCurrentAnswerServiceValidation();
        }),
      );

    this.eventBusService
      .on('cloneButtonClickEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.addMoreChild());
  }

  initVariables(id: string): void {
    const component = this.screenService.getCompFromDisplay(id);
    this.component = component;

    const itemsList = component ? JSON.parse(component.presetValue) : [];
    this.firstNameRef = this.getRefFromComponent('firstName');
    this.isNewRef = this.getRefFromComponent('isNew');
    this.idRef = this.getRefFromComponent('id');
    this.passportRef = this.getRefFromComponent('rfPasportSeries');
    this.itemsToSelect = this.getItemsToSelect(itemsList);
    this.isSingleChild = component?.attrs?.singleChild;
    this.hint = component?.attrs?.hint;
  }

  initStartValues(id: string): void {
    const cachedValue = this.screenService.getCompValueFromCachedAnswers(id);
    if (cachedValue) {
      const children = this.cachedAnswersService.parseCachedValue<unknown[]>(
        cachedValue,
        this.component,
      );
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

  updateItemValidationStatus(status: ItemStatus, itemId: string): void {
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
    const id = uuidv4();
    const newChild = {
      ...this.screenService.component?.attrs?.components?.reduce(
        (accum, value) => ({
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
    this.currentAnswersService.state = itemsToSend;
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
   */
  handleSelect(event: ChildI | null, index?: number, id?: string): void {
    Object.assign(this.items[index], event);
    if (event && event[this.idRef] === this.NEW_ID) {
      this.addNewChild(index);
    } else {
      const clearEvent = {
        isClear: event === null,
        id,
      };
      this.passDataToSend(this.items, clearEvent);
    }
  }

  isScreensAvailable(): boolean {
    const screensAmount = this.items.length;
    const repeatAmount = this.screenService.component?.attrs?.repeatAmount || this.defaultAvailable;

    return screensAmount >= repeatAmount;
  }

  isMoreThanOneChild(): boolean {
    return this.items.length > 1;
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
    return this.screenService.component?.attrs?.components.map((component) => {
      return {
        ...component,
        value: <string>child[component.id],
      };
    });
  }

  private getItemsToSelect(itemsList: Array<{ [key: string]: string }>): ChildI[] {
    return itemsList
      .map<ChildI>((child) => {
        return {
          ...child,
          id: child[this.idRef],
          text: child[this.firstNameRef],
        };
      })
      .concat(this.getChildForAddChildren(this.idRef));
  }

  private getChildForAddChildren(prop: string): ChildI {
    return {
      id: this.NEW_ID,
      text: 'Добавить нового ребенка',
      [prop]: this.NEW_ID,
    };
  }
}
