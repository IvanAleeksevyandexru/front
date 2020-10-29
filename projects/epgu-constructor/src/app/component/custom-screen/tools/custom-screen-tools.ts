import { ListItem } from 'epgu-lib';
import { DictionaryItem } from '../../shared/services/dictionary-api/dictionary-api.types';
import {
  CustomComponent,
  CustomListDictionary,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomScreenComponentTypes
} from '../custom-screen-components.types';

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

export function getCustomScreenDictionaryFirstState(): CustomListDictionary {
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
 * Возвращает true, если это выбор из справочника
 * @param type - тип поля
 */
export function likeDictionary(type: CustomScreenComponentTypes): boolean {
  return (
    CustomScreenComponentTypes.Dictionary === type || CustomScreenComponentTypes.Lookup === type
  );
}

/**
 * Возвращает true, если это выпадающий список
 * @param type - тип поля
 */
export function isDropDown(type: CustomScreenComponentTypes): boolean {
  return type === CustomScreenComponentTypes.DropDown || type === CustomScreenComponentTypes.MvdGiac;
}

/**
 * Возвращает true, если в зависимостях есть значения для проверки
 *
 * @param dependentComponent - зависимый компонент компонент
 * @param component - компонент
 * @param components - массив компонентов
 * @param relation - тип зависимости
 */
export const isHaveNeededValueForRelation = (
  dependentComponent: CustomComponent,
  component: CustomComponent,
  components: Array<CustomComponent>,
  relation: CustomComponentRefRelation,
): boolean => dependentComponent.attrs.ref.some((item) => isHaveNeededValue(components, component, item, relation));

/**
 * Возвращает true, если текущее состояние зависимости соответствует значению проверяемого компонента
 * @param components - массив компонентов
 * @param component - компонент
 * @param item - сведения о зависимости
 * @param relation - тип зависимости
 */
export const isHaveNeededValue = (
  components: Array<CustomComponent>,
  component: CustomComponent,
  item: CustomComponentRef,
  relation: CustomComponentRefRelation,
): boolean => {
  if (item.relation === relation) {
    const stateRelatedRelValue: any = components.find(
      (c: CustomComponent) => c.id === item.relatedRel,
    )?.value;

    if (likeDictionary(component.type) || isDropDown(component.type)) {
      return stateRelatedRelValue.id === item.val;
    } else {
      return stateRelatedRelValue === item.val;
    }
  }
  return relation === CustomComponentRefRelation.displayOn;
};

/**
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки и если нужно то удаляет РОССИЮ из списка
 * @param {Array<DictionaryItem>}items
 * @param {string}dictionaryName
 * @param {CustomComponent}component - тут хранится флаг, для удаление россии из словаря.
 */
export function getNormalizeDataCustomScreenDictionary(
  items: Array<DictionaryItem>,
  dictionaryName: string,
  component: CustomComponent,
): Array<ListItem> {
  const isRemoveRussiaFromList = component?.attrs.russia === false;
  const isRemoveUssrFromList = component?.attrs.ussr === false;
  const russiaCode = 'RUS'; // TODO HARDCODE возможно стоит вынести поля необходимые для удаления в JSON
  const ussrCode = 'SUN'; // TODO HARDCODE возможно стоит вынести поля необходимые для удаления в JSON
  let arr = items;
  if (isRemoveRussiaFromList) {
    arr = arr.filter((item) => ![ussrCode, russiaCode].includes(item.value));
  } else if (isRemoveUssrFromList) {
    arr = arr.filter((item) => ![ussrCode].includes(item.value));
  }
  return arr.map((item) => adaptiveDictionaryItemToListItem(item) as ListItem);
}

/**
 * Проверяет есть ли связь с типом калькуляция и если есть возвращает её
 * @param item - объект с информацией о связи
 */
export const findCalcRelation = (item: CustomComponentRef) => item.relation === CustomComponentRefRelation.calc;

/**
 * Возвращает найденую связь компонента с типом калькуляция
 * @param checkComponent - компонент для проверки
 */
export const getCalcRelation = (checkComponent: CustomComponent) => checkComponent.attrs.ref.find(findCalcRelation);



