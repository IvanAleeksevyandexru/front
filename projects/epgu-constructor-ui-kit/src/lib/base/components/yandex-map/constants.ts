import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';
import { IGeoObjectOptionsWithIconShape } from './yandex-map.interface';

interface iconType {
  href: string;
  size: number[];
  offset: number[];
}
@Injectable()
export class Icons {

  get blue(): IGeoObjectOptionsWithIconShape {
    return {
      iconLayout: this.pinLayout(),
      iconShape: {
        type: 'Circle',
        coordinates: [0, -10],
        radius: 20,
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

  get clusterBlue(): iconType {
    return {
      href: `${this.config.staticDomainAssetsPath}/assets/icons/svg/clusterblue.svg`,
      size: [40, 40],
      offset: [-20, -20],
    };
  }

  get clusterRed(): iconType {
    return {
      href: `${this.config.staticDomainAssetsPath}/assets/icons/svg/clusterred.svg`,
      size: [40, 40],
      offset: [-20, -20],
    };
  }

  get clusterBlueRed(): iconType {
    return {
      href: `${this.config.staticDomainAssetsPath}/assets/icons/svg/clusterbluered.svg`,
      size: [40, 40],
      offset: [-20, -20],
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
      {
        build: function () {
          this.constructor.superclass.build.call(this);
        },

        clear: function () {
          this.constructor.superclass.clear.call(this);
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
