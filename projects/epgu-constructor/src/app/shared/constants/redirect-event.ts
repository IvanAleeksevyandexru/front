export enum MobileEventType {
  open_screen = 'open_screen',
  exit = 'exit',
  file_download = 'file_download',
}

interface MobileEventParam<T> {
  key: string;
  value: T;
}

export interface MobileEvent<T> {
  eventType: MobileEventType;
  eventParams: MobileEventParam<T>[];
}

/**
 * Опции для перенаправления на страницу со списком отправленных
 * заявлений в MobileView (для новая версия приложения - native)
 */

export const OPTIONS_FEED_MV: MobileEvent<string> = {
  eventType: MobileEventType.open_screen,
  eventParams: [{ key: 'screen', value: 'Feed' }], // реализовано в новой версии, в нативном МП
};

// /**
//  * Опции для перенаправления на страницу со списком отправленных
//  * заявлений в MobileView (для страрой версия приложения - xamarin)
//  */
// const OPTIONS_FEED_MV_OLD = {
//   eventType: 'open_screen',
//   eventParams: [
//     { key: 'screen', value: 'OrderDetails' },
//     { key: 'orderId', value: тут надо указать orderId }
//   ]
// };

export const OPTIONS_FEED_EXIT: MobileEvent<string> = {
  eventType: MobileEventType.exit,
  eventParams: [],
};

export const MobilViewEvents: Record<string, MobileEvent<string>> = {
  feed: OPTIONS_FEED_MV,
  exit: OPTIONS_FEED_EXIT,
};

export const createMobileEvent = <T>(
  type: MobileEventType,
  params: MobileEventParam<T>[] = [],
): MobileEvent<T> => ({
  eventType: type,
  eventParams: params,
});

export const createDownloadEvent: (link: string) => MobileEvent<string> = (link: string) =>
  createMobileEvent(MobileEventType.file_download, [{ key: 'file_path', value: link }]);
