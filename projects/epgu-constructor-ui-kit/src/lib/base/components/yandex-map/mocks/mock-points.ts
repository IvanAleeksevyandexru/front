import { IFeatureTypes } from '../yandex-map.interface';

export const mockExpandedPoint = [
  {
    balloonContentHeader: 'Участковая избирательная комиссия №3933',
    pollStationNumber: 3933,
    pollStationRegion: 50,
    expanded: true,
  },
  {
    balloonContentHeader: 'Участковая избирательная комиссия №3932',
    pollStationNumber: 3932,
    pollStationRegion: 50,
    expanded: true,
  },
];

export const mockPointWithoutCoords = {
  type: IFeatureTypes.Feature,
  id: '4504034394378_50',
  geometry: {
    type: 'Point',
    coordinates: [null, null],
  },
  properties: {
    res: {
      balloonContentHeader: 'Участковая избирательная комиссия №3936',
      pollStationNumber: 3936,
      pollStationRegion: 50,
      expanded: false,
    },
  },
  options: {
    iconImageHref: '/assets/icons/svg/point_blue.svg',
  },
  id_16278971881063469: '7144',
};
