import { ListItem } from 'epgu-lib';
import {
  CustomComponentDictionaryState, CustomComponentDropDownItemList,
  CustomComponentInterface, CustomComponentState
} from '../../../../interfaces/custom-component.interface';
import { DictionaryItem } from '../../../../interfaces/dictionary-options.interface';
import { DATE_STRING_DOT_FORMAT } from '../../../../constant/global';
import * as moment_ from 'moment';
const moment = moment_;



export enum CUSTOM_COMPONENT_ITEM_TYPE {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  HiddenDictionary = 'HiddenDictionary',
  HiddenLookup = 'HiddenLookup',
  HiddenInput = 'HiddenInput',
  DropDown = 'DropDown',
  StringInput = 'StringInput',
  DateInput = 'DateInput',
  RadioInput = 'RadioInput',
  CompositeRadioButton = 'CompositeRadioButton',
  Lookup = 'Lookup',
}

function adaptiveDictionaryItemToListItem(item: DictionaryItem): Partial<ListItem> {
  return {
    id: item.value,
    text: item.title,
    formatted: '',
    // 'hidden': false,
    originalItem: item,
    compare: () => false,
  };
}

export function getCustomScreenDictionaryFirstState(): CustomComponentDictionaryState {
  return {
    loading: true,
    loadError: false,
    loadEnd: false,
    paginationLoading: true,
    page: 0,
    data: {} as any,
    list: [],
    origin: {} as any,
    selectedItem: {} as any,
  };
}

export function likeDictionary(type: CUSTOM_COMPONENT_ITEM_TYPE) {
  return (
    CUSTOM_COMPONENT_ITEM_TYPE.Dictionary === type || CUSTOM_COMPONENT_ITEM_TYPE.Lookup === type
  );
}

export function isDropDown(type: CUSTOM_COMPONENT_ITEM_TYPE) {
  return CUSTOM_COMPONENT_ITEM_TYPE.DropDown === type;
}

/**
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки и если нужно то удаляет РОССИЮ из списка
 * @param {Array<DictionaryItem>}items
 * @param {string}dictionaryName
 * @param {CustomComponentInterface}component - тут хранится флаг, для удаление россии из словаря.
 */
export function getNormalizeDataCustomScreenDictionary(
  items: Array<DictionaryItem>,
  dictionaryName: string,
  component: CustomComponentInterface): Array<ListItem> {
  const isRemoveRussiaFromList = component?.attrs.russia === false;
  let arr = items;
  if (isRemoveRussiaFromList) {
    const russiaCode = 'RUS'; // TODO HARDCODE возможно стоит вынести поля необходимые для удаления в JSON
    const sssrCode = 'SUN'; // TODO HARDCODE возможно стоит вынести поля необходимые для удаления в JSON
    arr = arr.filter(item => ![sssrCode, russiaCode].includes(item.value));
  }
  return arr.map((item) => adaptiveDictionaryItemToListItem(item) as ListItem);
}

/**
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки
 * @param {CustomComponentDropDownItemList}items
 * @param {string}dictionaryName
 * @param {CustomComponentInterface}component - тут хранится флаг, для удаление россии из словаря.
 */
export function adaptiveDropDown(items: CustomComponentDropDownItemList): Array<Partial<ListItem>> {
  return items.map((item, index) => {
    return  {
      id: `${item.name}-${index}`,
      text: item.name,
      formatted: '',
      // 'hidden': false,
      originalItem: item,
      compare: () => false,
    };
  });
}

export function calcDependedComponent(
  component: CustomComponentInterface,
  state: CustomComponentState,
  components: Array<CustomComponentInterface>) {
  const isComponentDependOn = (arr = []) => arr?.some((el) => el.relatedRel === component.id);
  // TODO добавить возможность зависить от нескольких полей
  const dependentComponents = components.filter((item) =>
    isComponentDependOn(item.attrs?.ref),
  );

  dependentComponents.forEach((dependentComponent) => {
    if (likeDictionary(component.type)) {
      const dictionaryOfTheDependentComponent: DictionaryItem = state[component.id]?.value;

      // TODO Временный hardcode;
      state[dependentComponent.id].isShow =
        // TODO добавить возможность зависить от нескольких полей
        dependentComponent.attrs.ref[0].val === dictionaryOfTheDependentComponent.value;
    }
  });
}

export function CheckInputValidationComponentList(value: string, component: CustomComponentInterface): number {
  const regExpArr = component?.attrs?.validation?.map((item) => {
    try {
      return new RegExp(item.value);
    } catch {
      console.error(`Неверный формат RegExp выражения: ${item.value}. Заменено на /.*/`);
      return new RegExp(/.*/);
    }
  });

  let result = -1; // if result === -1 input value is considered valid

  if (regExpArr) {
    regExpArr.every((regExp, index) => {
      if (!regExp.test(value)) {
        result = index;
        return false;
      }
      return true;
    });
  }

  return result;
}

export function getInitStateItemComponentList(component: CustomComponentInterface) {
  const { value } = component;
  const hasRelatedRef = component.attrs.ref?.length;

  let valueFormatted: string | Date;
  switch (component.type) {
    case CUSTOM_COMPONENT_ITEM_TYPE.DateInput:
      valueFormatted = moment(value, DATE_STRING_DOT_FORMAT).toDate() || moment().toDate();
      break;
    default:
      valueFormatted = value;
      break;
  }

  return {
    valid: false,
    errorMessage: '',
    value: valueFormatted,
    component,
    isShow: !hasRelatedRef,
  };
}
