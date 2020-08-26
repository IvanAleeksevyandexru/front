import { ListItem } from 'epgu-lib';
import { FMS_COUNTRIES_DICTIONARY, RUSSIA_DICTIONARY_NAME } from '../../../../constant/global';
import { CustomComponentDictionaryState } from '../../../../interfaces/custom-component.interface';
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
  FileUploadComponent = 'FileUploadComponent',
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
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки, а если словарь
 * словарь является {@link FMS_COUNTRIES_DICTIONARY} то страну РОССИЯ располагаю первым
 * @param items
 * @param dictionaryName
 */
export function getNormalizeDataCustomScreenDictionary(items: Array<DictionaryItem>, dictionaryName: string): Array<ListItem> {
  const arr = dictionaryName === FMS_COUNTRIES_DICTIONARY ? putRussiaToFirstInArrForFmsCountriesDictionary(items) : items;
  return arr.map((item) => adaptiveDictionaryItemToListItem(item) as ListItem)
}

function putRussiaToFirstInArrForFmsCountriesDictionary(items: Array<DictionaryItem>): Array<DictionaryItem> {
  const rusItemIndex = items.findIndex(item => item.title.toLowerCase() === RUSSIA_DICTIONARY_NAME.toLowerCase());
  return [ items[rusItemIndex] ]
    .concat(items.slice(0, rusItemIndex))
    .concat(items.slice(rusItemIndex + 1))
}
