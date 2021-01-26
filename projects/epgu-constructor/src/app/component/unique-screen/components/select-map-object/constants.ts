import { Injectable } from '@angular/core';
import { ConfigService } from '../../../../core/services/config/config.service';

@Injectable()
export class Icons {
  public readonly red = {
    iconLayout: 'default#image',
    iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/point_red.svg`,
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
    iconImageHref: `${this.config.staticDomainAssetsPath}/assets/icons/svg/point_blue.svg`,
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

  constructor(public config: ConfigService) { }
}

export const TIMEZONE_STR_OFFSET = -6;
