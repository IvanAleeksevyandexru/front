import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { DictionaryItem } from '../../../services/api/dictionary-api/dictionary-api.types';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';
import {
  CustomComponent, CustomComponentDictionaryState, CustomComponentDropDownItemList,
  CustomComponentState, CustomScreenComponentTypes
} from '../custom-screen.types';
const moment = moment_;


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

export function likeDictionary(type: CustomScreenComponentTypes) {
  return (
    CustomScreenComponentTypes.Dictionary === type || CustomScreenComponentTypes.Lookup === type
  );
}

export function isDropDown(type: CustomScreenComponentTypes) {
  return CustomScreenComponentTypes.DropDown === type;
}

/**
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки и если нужно то удаляет РОССИЮ из списка
 * @param {Array<DictionaryItem>}items
 * @param {string}dictionaryName
 * @param {CustomComponent}component - тут хранится флаг, для удаление россии из словаря.
 */
export function getNormalizeDataCustomScreenDictionary(
  items: Array<DictionaryItem>,
  dictionaryName: string,
  component: CustomComponent): Array<ListItem> {
  const isRemoveRussiaFromList = component?.attrs.russia === false;
  const isRemoveUssrFromList = component?.attrs.ussr === false;
  const russiaCode = 'RUS'; // TODO HARDCODE возможно стоит вынести поля необходимые для удаления в JSON
  const ussrCode = 'SUN'; // TODO HARDCODE возможно стоит вынести поля необходимые для удаления в JSON
  let arr = items;
  if (isRemoveRussiaFromList) {
    arr = arr.filter(item => ![ussrCode, russiaCode].includes(item.value));
  } else if (isRemoveUssrFromList) {
    arr = arr.filter(item => ![ussrCode].includes(item.value));
  }
  return arr.map((item) => adaptiveDictionaryItemToListItem(item) as ListItem);
}

/**
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки
 * @param {CustomComponentDropDownItemList}items
 * @param {string}dictionaryName
 * @param {CustomComponent}component - тут хранится флаг, для удаление россии из словаря.
 */
export function adaptiveDropDown(items: CustomComponentDropDownItemList): Array<Partial<ListItem>> {
  return items.map((item, index) => {
    return {
      id: `${item.label}-${index}`,
      text: item.label,
      formatted: '',
      unselectable: item.disable === true,
      originalItem: item,
      compare: () => false,
    };
  });
}

/**
 * Функция проверяет зависимые компоненты и перезаписывает состояние в state.
*/
export function calcDependedComponent(
  component: CustomComponent,
  state: CustomComponentState,
  components: Array<CustomComponent>) {
  const isLookup = component.type === 'Lookup';
  const isComponentDependOn = (arr = []) => arr?.some((el) => el.relatedRel === component.id);
  const dependentComponents = components.filter((item) => isComponentDependOn(item.attrs?.ref));

  dependentComponents.forEach((dependentComponent) => {
    state[dependentComponent.id].isShown = dependentComponent.attrs.ref.some(item => {
      const stateRelatedRel = isLookup ? state[item.relatedRel]?.value : state[item.relatedRel];
      return stateRelatedRel?.value === item.val;
    });
  });
}

export function CheckInputValidationComponentList(value: string, component: CustomComponent): number {
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

export function getInitStateItemComponentList(component: CustomComponent) {
  const { value } = component;
  const hasRelatedRef = component.attrs.ref?.length;

  let valueFormatted: string | Date;
  switch (component.type) {
    case CustomScreenComponentTypes.DateInput:
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
    isShown: !hasRelatedRef,
  };
}

export function checkLegalInn(value: string) {
  const inn = value.split('').map((char) => parseInt(char, 0));
  const sumInn =
    2 * inn[0] +
    4 * inn[1] +
    10 * inn[2] +
    3 * inn[3] +
    5 * inn[4] +
    9 * inn[5] +
    4 * inn[6] +
    6 * inn[7] +
    8 * inn[8];

  const controlSum = sumInn - Math.trunc(sumInn / 11) * 11;
  const isCorrectInn = controlSum === inn[9] || (controlSum === 10 && inn[9] === 0);

  return isCorrectInn ? -1 : 0;
}

export function checkPersonInn(value: string) {
  const inn = value.split('').map((char) => parseInt(char, 0));
  const sumInn =
    3 * inn[0] +
    7 * inn[1] +
    2 * inn[2] +
    4 * inn[3] +
    10 * inn[4] +
    3 * inn[5] +
    5 * inn[6] +
    9 * inn[7] +
    4 * inn[8] +
    6 * inn[9] +
    8 * inn[10];

  const controlSum = sumInn - Math.trunc(sumInn / 11) * 11;
  const isCorrectInn = controlSum === inn[11] || (controlSum === 10 && inn[11] === 0);

  return isCorrectInn ? -1 : 0;
}
