export class Icons {

  public static readonly red = {
    iconLayout: 'default#image',
    iconImageHref: '/assets/icons/svg/point_red.svg',
    iconContentOffset: [11, 15],
    iconShape: {
      type: 'Circle',
      coordinates: [0, 0],
      radius: 23
    },
    hideIconOnBalloonOpen: false,
    openEmptyBalloon: true
  };

  public static readonly blue = {
    iconLayout: 'default#image',
    iconImageHref: '/assets/icons/svg/point_blue.svg',
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
}
