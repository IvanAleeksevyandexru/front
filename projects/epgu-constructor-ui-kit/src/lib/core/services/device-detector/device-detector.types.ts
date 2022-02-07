export enum LoadServiceDeviceType {
  'desk' = 'desk',
  'mob' = 'mob',
  'tab' = 'tab',
}

export enum BrowserName {
  CHROME = 'CHROME',
  FIREFOX = 'FIREFOX',
  DESKTOP_SAFARI = 'DESKTOP_SAFARI',
  MOBILE_SAFARI = 'MOBILE_SAFARI',
  ETC = 'ETC',
}

export const MOBILE_VIEW_COOKIE_NAME = 'mobVersion';

export const WEB_VIEW_USER_AGENTS = [
  'mp_', // индикатор для мобильных приложения Госуслуг
  'WebView',
  '(iPhone|iPod|iPad)(?!.*Safari)',
  'Android.*(wv|.0.0.0)',
  'Linux; U; Android',
];
