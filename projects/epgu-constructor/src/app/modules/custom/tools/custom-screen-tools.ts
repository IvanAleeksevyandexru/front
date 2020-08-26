import { ListItem } from 'epgu-lib';
import {
  CustomComponentDictionaryState,
  CustomComponentInterface
} from '../../../../interfaces/custom-component.interface';
import { DictionaryItem } from '../../../../interfaces/dictionary-options.interface';


export enum CUSTOM_COMPONENT_ITEM_TYPE {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  DropDown = 'DropDown',
  ForeignCitizenship = 'ForeignCitizenship',
  StringInput = 'StringInput',
  DateInput = 'DateInput',
  RadioInput = 'RadioInput',
  CompositeRadioButton = 'CompositeRadioButton',
  Lookup = 'Lookup',
}

export function adaptiveDictionaryItemToListItem(item: DictionaryItem): Partial<ListItem> {
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
  // let arr = dictionaryName === FMS_COUNTRIES_DICTIONARY ? putRussiaToFirstInArrForFmsCountriesDictionary(items) : items;
  let arr = items;
  if (isRemoveRussiaFromList) {
    const russiaCode = 'RUS';
    arr = arr.filter(item => item.value === russiaCode)
  }
  return arr.map((item) => adaptiveDictionaryItemToListItem(item) as ListItem)
}

// function putRussiaToFirstInArrForFmsCountriesDictionary(items: Array<DictionaryItem>): Array<DictionaryItem> {
//   const rusItemIndex = items.findIndex(item => item.title.toLowerCase() === RUSSIA_DICTIONARY_NAME.toLowerCase());
//   return [ items[rusItemIndex] ]
//     .concat(items.slice(0, rusItemIndex))
//     .concat(items.slice(rusItemIndex + 1))
// }
