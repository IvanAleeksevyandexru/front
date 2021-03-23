/**
 * На странице есть несколько мест где в html прилетает блоки с аттрибутов,
 * которые нужно переключать при клике на родителя;
 * @return - true - если клементы был переключен иначе false;
 */
export function getHiddenBlock(el: HTMLElement, id: string): HTMLElement {
  const selector = `[data-hidden-id=${id}]`;
  return el.querySelector(selector);
}

/**
 * Возвращает true, если объекты равны при сравнии
 * @param prev - объект 1
 * @param next - объект 2
 */
export function isEqualObj<T>(prev: T, next: T): boolean {
  return JSON.stringify(prev) === JSON.stringify(next);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUndefined(value: any): boolean {
  return typeof value === 'undefined';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toBoolean(value: any): boolean {
  return isBoolean(value) ? value : (value === 'true');
}
