import { ComponentDto } from '@epgu/epgu-constructor-types';

/**
 * Функция возвращает ключ для получения словаря
 * @param component экземпляр компонента
 */
export function getDictKeyByComp(component: ComponentDto): string {
  return component.attrs.dictionaryType + component.id;
}
