import { LogicComponentEventTypes, LogicComponents } from '@epgu/epgu-constructor-types';

export const isOnInitComponent = (component: LogicComponents): boolean =>
  !component.attrs.events || component.attrs.events.includes(LogicComponentEventTypes.ON_INIT);
export const isOnBeforeSubmitComponent = (component: LogicComponents): boolean =>
  component.attrs.events && component.attrs.events.includes(LogicComponentEventTypes.ON_BEFORE_SUBMIT);
