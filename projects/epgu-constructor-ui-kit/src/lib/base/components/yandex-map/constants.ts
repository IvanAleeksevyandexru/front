import { Injectable } from '@angular/core';
import { ConfigService } from '../../../core/services/config/config.service';

@Injectable()
export class Icons {
  public readonly red = {
    iconLayout: 'default#image',
    iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/pinred.svg`,
    iconContentOffset: [11, 15],
    iconShape: {
      type: 'Circle',
      coordinates: [0, 0],
      radius: 23
    },
    hideIconOnBalloonOpen: false,
    openEmptyBalloon: true
  };

  public readonly blue = {
    iconLayout: 'default#image',
    iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/pinblue.svg`,
    iconImageSize: [24, 40],
    iconImageOffset: [-12, -20],
    iconContentOffset: [11, 15],
    iconShape: {
      type: 'Circle',
      coordinates: [0, 0],
      radius: 23
    },
    hideIconOnBalloonOpen: false,
    openEmptyBalloon: true
  };

  public readonly clusterBlue =       {
    href: `${this.config.staticDomainAssetsPath}/assets/icons/svg/clusterblue.svg`,
    size: [40, 40],
    offset: [-20, -20]
  };

  public readonly clusterRed =       {
    href: `${this.config.staticDomainAssetsPath}/assets/icons/svg/clusterred.svg`,
    size: [40, 40],
    offset: [-20, -20]
  };

  constructor(public config: ConfigService) { }
}
