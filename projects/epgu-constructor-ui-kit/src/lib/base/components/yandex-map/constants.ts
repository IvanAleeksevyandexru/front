import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';
import { IGeoObjectOptionsWithIconShape } from './yandex-map.interface';

@Injectable()
export class Icons {
  get blue(): IGeoObjectOptionsWithIconShape {
    return {
      iconLayout: this.pinLayout(),
      iconShape: {
        type: 'Circle',
        coordinates: [0, -25],
        radius: 25,
      },
      hideIconOnBalloonOpen: false,
      openEmptyBalloon: false,
    };
  }

  get userOrange(): IGeoObjectOptionsWithIconShape {
    return {
      iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/userOrange.svg`,
      iconShape: {
        type: 'Circle',
        // Круг описывается в виде центра и радиуса
        coordinates: [0, -20],
        radius: 20,
      },
    };
  }

  // TODO: На данный момент нет интерфейса под кластер в ymaps. Подождать когда добавят
  get cluster(): unknown {
    return {
      clusterIconLayout: this.clusterLayout(),
      iconShape: {
        type: 'Circle',
        coordinates: [0, -20],
        radius: 20,
      },
    };
  }

  get childsHome(): IGeoObjectOptionsWithIconShape {
    return {
      iconLayout: 'default#image',
      iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/child's-home.svg`,
      iconContentOffset: [11, 15],
      iconShape: {
        type: 'Circle',
        coordinates: [0, 0],
        radius: 23,
      },
    };
  }

  constructor(public config: ConfigService) {}

  private pinLayout(): ymaps.IClassConstructor<ymaps.ILayout> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ymaps = (window as any).ymaps;
    return ymaps.templateLayoutFactory.createClass(
      '<div class="pin {{properties.pinStyle}}{% if properties.isActive %} pin-red{% endif %}">',
    );
  }

  private clusterLayout(): ymaps.IClassConstructor<ymaps.ILayout> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ymaps = (window as any).ymaps;
    return ymaps.templateLayoutFactory.createClass(
      '<div class="cluster {{properties.clusterStyle}}"><span class="cluster-elements">{{ properties.amount }}</span></div>',
      {
        build: function () {
          this.constructor.superclass.build.call(this);
          const props = this.getData().properties;
          props.amount =
            this.getData().properties.geoObjects.length > 99
              ? '99+'
              : this.getData().properties.geoObjects.length;
          props.clusterStyle = props.clusterStyle || 'cluster-blue';
          if (!this.inited) {
            this.inited = true;
            this.rebuild();
          }
        },
      },
    );
  }
}

export const KINDERGARTEN_SEARCH_RADIUS_IN_METERS = 5000;
export const KINDERGATEN_MAX_VALUE = 50;
export const CHILDS_HOME_PROPERTIES = {
  balloonContent: 'Адрес ребенка',
  hintContent: 'Адрес ребенка',
};
