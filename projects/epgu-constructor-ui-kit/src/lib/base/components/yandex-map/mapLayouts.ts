import { Injectable } from '@angular/core';

@Injectable()
export class MapLayouts {
  // Создание макета балуна на основе Twitter Bootstrap.
  public static getJusticeBalloonLayout(): ymaps.IClassConstructor<ymaps.ILayout> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ymaps } = window as any;
    const myBalloonLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="popover">' +
        '<a class="close">&times;</a>' +
        '<div class="popover-inner">' +
        '$[[options.contentLayout observeSize minWidth=252 maxWidth=252 maxHeight=40]]' +
        '</div>' +
        '</div>',
      {
        /**
         * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
         * @function
         * @name build
         */
        build() {
          this.constructor.superclass.build.call(this);
          this._$element = this.getParentElement().querySelector('.popover');
          this.applyElementOffset();
          this._$element
            .querySelector('.close')
            .addEventListener('click', this.onCloseClick.bind(this));
        },

        /**
         * Удаляет содержимое макета из DOM.
         * @function
         * @name clear
         */
        clear() {
          this.constructor.superclass.clear.call(this);
        },

        /**
         * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
         * @function
         * @name onSublayoutSizeChange
         */
        onSublayoutSizeChange() {
          myBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

          if (!this._$element) {
            return;
          }

          this.applyElementOffset();

          this.events.fire('shapechange');
        },

        /**
         * Сдвигаем балун, чтобы был над пином
         * @function
         * @name applyElementOffset
         */
        applyElementOffset() {
          this._$element.style.left = `${-(this._$element.offsetWidth / 2)}px`;
          this._$element.style.top = `${-(this._$element.offsetHeight + 29)}px`;
        },

        /**
         * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
         * @function
         * @name onCloseClick
         */
        onCloseClick(e) {
          e.preventDefault();

          this.events.fire('userclose');
        },

        /**
         * Используется для автопозиционирования (balloonAutoPan).
         * @function
         * @name getClientBounds
         * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
         */
        getShape() {
          if (!this._$element) {
            return myBalloonLayout.superclass.getShape.call(this);
          }

          const position = { left: this._$element.offsetLeft, top: this._$element.offsetTop };
          return new ymaps.shape.Rectangle(
            new ymaps.geometry.pixel.Rectangle([
              [position.left, position.top],
              [
                position.left + this._$element.offsetWidth,
                position.top + this._$element.offsetHeight,
              ],
            ]),
          );
        },
      },
    );
    return myBalloonLayout;
  }

  public static getCommonBalloonLayout(): ymaps.IClassConstructor<ymaps.ILayout> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { ymaps } = window as any;
    const myBalloonLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="balloon-common">' +
        '$[[options.contentLayout observeSize minWidth=360 maxWidth=360 maxHeight=164]]' +
        '</div>',
      {
        /**
         * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
         * @function
         * @name build
         */
        build() {
          this.constructor.superclass.build.call(this);
          this._$element = this.getParentElement().querySelector('.balloon-common');
          this.applyElementOffset();
        },

        /**
         * Удаляет содержимое макета из DOM.
         * @function
         * @name clear
         */
        clear() {
          this.constructor.superclass.clear.call(this);
        },

        /**
         * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
         * @function
         * @name onSublayoutSizeChange
         */
        onSublayoutSizeChange() {
          myBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

          if (!this._$element) {
            return;
          }

          this.applyElementOffset();

          this.events.fire('shapechange');
        },

        /**
         * Сдвигаем балун, чтобы был над пином
         * @function
         * @name applyElementOffset
         */
        applyElementOffset() {
          this._$element.style.left = `${-(this._$element.offsetWidth / 2)}px`;
          this._$element.style.top = `${-(this._$element.offsetHeight + 34)}px`;
        },

        /**
         * Используется для автопозиционирования (balloonAutoPan).
         * @function
         * @name getClientBounds
         * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
         */
        getShape() {
          if (!this._$element) {
            return myBalloonLayout.superclass.getShape.call(this);
          }

          const position = { left: this._$element.offsetLeft, top: this._$element.offsetTop };
          return new ymaps.shape.Rectangle(
            new ymaps.geometry.pixel.Rectangle([
              [position.left, position.top],
              [
                position.left + this._$element.offsetWidth,
                position.top + this._$element.offsetHeight,
              ],
            ]),
          );
        },
      },
    );
    return myBalloonLayout;
  }
}
