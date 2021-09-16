import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';
import { ymaps } from './yandex-map.types';

interface iconType {
  href: string;
  size: number[];
  offset: number[];
}
@Injectable()
export class Icons {
  get red(): ymaps.IGeoObjectOptions {
    return {
      iconLayout: 'default#image',
      iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/pinred.svg`,
      iconContentOffset: [11, 15],
      iconShape: {
        type: 'Circle',
        coordinates: [0, 0],
        radius: 23,
      },
      hideIconOnBalloonOpen: false,
      openEmptyBalloon: true,
    };
  }

  get redChecked(): ymaps.IGeoObjectOptions {
    return {
      iconLayout: 'default#image',
      iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/pincheck.svg`,
      iconContentOffset: [11, 15],
      iconShape: {
        type: 'Circle',
        coordinates: [0, 0],
        radius: 23,
      },
      hideIconOnBalloonOpen: false,
      openEmptyBalloon: true,
    };
  }

  get blue(): ymaps.IGeoObjectOptions {
    return {
      iconLayout: 'default#image',
      iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/pinblue.svg`,
      iconImageSize: [24, 40],
      iconImageOffset: [-12, -20],
      iconContentOffset: [11, 15],
      iconShape: {
        type: 'Circle',
        coordinates: [0, 0],
        radius: 23,
      },
      hideIconOnBalloonOpen: false,
      openEmptyBalloon: true,
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

  get childsHome(): ymaps.IGeoObjectOptions {
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
}

export const KINDERGARTEN_SEARCH_RADIUS_IN_METERS = 5000;
export const KINDERGATEN_MAX_VALUE = 50;
export const CHILDS_HOME_PROPERTIES = {
  balloonContent: 'Адрес ребенка',
  hintContent: 'Адрес ребенка'
};
