import { ListItem } from 'epgu-lib';
import * as moment_ from 'moment';
import { checkINN, checkOgrn, checkOgrnip } from 'ru-validation-codes';
import { DictionaryItem } from '../../../services/api/dictionary-api/dictionary-api.types';
import { DATE_STRING_DOT_FORMAT } from '../../../shared/constants/dates';
import {
  CustomComponent,
  CustomComponentDictionaryState,
  CustomComponentDropDownItemList,
  CustomComponentRef,
  CustomComponentRefRelation,
  CustomComponentState,
  CustomScreenComponentTypes
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
 * Адаптирует массив в вид необходимый для компонентов из библлиотеки
 * @param items - массив элементов для преобразования
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
 * Возвращает true, если это компонент с типом Lookup
 * @param component - компонент
 */
export const isLookup = (component: CustomComponent): boolean => component.type === CustomScreenComponentTypes.Lookup;
/**
 * Возвращает true, если это выпадающий список
 * @param component - компонент
 */
export const isDropDown = (component: CustomComponent): boolean => component.type === CustomScreenComponentTypes.DropDown;
/**
 * Возвращает true, если это компонент с типом CheckBox
 * @param component - компонент
 */
export const isCheckBox = (component: CustomComponent): boolean => component.type === CustomScreenComponentTypes.CheckBox;

/**
 * Возвращает true, если текущее состояние зависимости соответствует значению проверяемого компонента
 * @param state - Хранилище данных
 * @param component - компонент
 * @param item - сведения о зависимости
 * @param relation - тип зависимости
 */
export const isHaveNeededValue = (
  state: CustomComponentState,
  component: CustomComponent,
  item: CustomComponentRef,
  relation: CustomComponentRefRelation,
): boolean => {
  if (item.relation == relation) {
    let stateRelatedRelValue: any;

    if (isLookup(component)) {
      stateRelatedRelValue = state[item.relatedRel]?.value?.value;
    } else if (isDropDown(component)) {
      stateRelatedRelValue = state[item.relatedRel]?.value?.code;
    } else {
      stateRelatedRelValue = state[item.relatedRel].value;
    }

    return stateRelatedRelValue === item.val;
  }
  return relation === CustomComponentRefRelation.displayOn;
};

/**
 * Функция проверяет зависимые компоненты и перезаписывает состояние в state.
 */
export function calcDependedComponent(
  component: CustomComponent,
  state: CustomComponentState,
  components: Array<CustomComponent>,
) {
  const isComponentDependOn = (arr = []) => arr?.some((el) => el.relatedRel === component.id);
  const dependentComponents = components.filter((item) => isComponentDependOn(item.attrs?.ref));

  dependentComponents.forEach((dependentComponent) => {
    //Проверяем статусы показа и отключённости
    state[dependentComponent.id].isShown = dependentComponent.attrs.ref.some((item) =>
      isHaveNeededValue(state, component, item, CustomComponentRefRelation.displayOn),
    );
    state[dependentComponent.id].disabled = dependentComponent.attrs.ref.some((item) =>
      isHaveNeededValue(state, component, item, CustomComponentRefRelation.disabled),
    );
  });
}

export function CheckInputValidationComponentList(
  value: string,
  component: CustomComponent,
): number {
  // Ищет первое невалидное выражение
  let result =
    component?.attrs?.validation?.findIndex((item) => {
      try {
        const regexp = new RegExp(item.value);
        return !regexp.test(value);
      } catch {
        console.error(`Неверный формат RegExp выражения: ${item.value}`);
      }
    }) ?? -1;

  // Если не было невалидного значения, проверяет следующую валидацию
  if (!~result && !isValueValid(component.type, value)) {
    result = 0;
  }

  return result;
}

export function getInitStateItemComponentList(component: CustomComponent, errorMessage: string = '') {
  const { value } = component;
  const hasRelatedRef = !component.attrs.ref?.length;

  let valueFormatted: string | Date;
  switch (component.type) {
    case CustomScreenComponentTypes.DateInput:
      valueFormatted = moment(value, DATE_STRING_DOT_FORMAT).toDate();
      break;
    case CustomScreenComponentTypes.CheckBox:
      valueFormatted = component.attrs?.checked;
      break;
    default:
      valueFormatted = value;
      break;
  }

  return {
    valid: false,
    errorMessage,
    value: valueFormatted,
    component,
    isShown: hasRelatedRef,
  };
}

export function isValueValid(type, value): boolean {
  const customComponentType = CustomScreenComponentTypes;
  if (type === customComponentType.OgrnInput) {
    return checkOgrn(value);
  }
  if (type === customComponentType.OgrnipInput) {
    return checkOgrnip(value);
  }
  if ([customComponentType.PersonInnInput, customComponentType.LegalInnInput].includes(type)) {
    return checkINN(value);
  }
  return true;
}
