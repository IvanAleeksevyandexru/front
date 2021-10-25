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
  get red(): IGeoObjectOptionsWithIconShape {
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

  get redChecked(): IGeoObjectOptionsWithIconShape {
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

  get blue(): IGeoObjectOptionsWithIconShape {
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
}

export const KINDERGARTEN_SEARCH_RADIUS_IN_METERS = 5000;
export const KINDERGATEN_MAX_VALUE = 50;
export const CHILDS_HOME_PROPERTIES = {
  balloonContent: 'Адрес ребенка',
  hintContent: 'Адрес ребенка',
};
