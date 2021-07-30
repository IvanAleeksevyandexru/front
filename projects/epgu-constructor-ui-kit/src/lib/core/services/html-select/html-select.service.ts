import { Injectable } from '@angular/core';

@Injectable()
export class HtmlSelectService {

  /**
   * На странице есть несколько мест где в html прилетает блоки с аттрибутов,
   * которые нужно переключать при клике на родителя;
   * @return - true - если клементы был переключен иначе false;
   */
  public getHiddenBlock(el: HTMLElement, id: string): HTMLElement {
    const selector = `[data-hidden-id="${id}"]`;
    return el.querySelector(selector);
  }
}
