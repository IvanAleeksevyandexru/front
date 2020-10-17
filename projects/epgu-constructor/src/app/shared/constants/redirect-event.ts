/**
 * Опции для перенаправления на страницу со списком отправленных
 * заявлений в MobileView (для новая версия приложения - native)
 */
const OPTIONS_FEED_MV = {
  eventType: 'open_screen',
  eventParams: [{ key: 'screen', value: 'Feed' }] // реализовано в новой версии, в нативном МП
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

const OPTIONS_FEED_EXIT = {
  eventType: 'exit',
  eventParams: []
};

export const  MobilViewEvents  = {
  feed: OPTIONS_FEED_MV,
  exit: OPTIONS_FEED_EXIT
};
