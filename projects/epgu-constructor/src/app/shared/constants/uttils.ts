/**
 * На странице есть несколько мест где в html прилетает блоки с аттрибутов,
 * которые нужно переключать при клике на родителя;
 * @return - true - если клементы был переключен иначе false;
 */
export function getHiddenBlock(el: HTMLElement, id): HTMLElement {
  const selector = `[data-hidden-id=${id}]`;
  return el.querySelector(selector);
}
