export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export type NavigationPayloadData = {
  [key: string]: {
    value: string,
    visited?: boolean,
  }
} | string;

export type NavigationPayloadOptions = {
  componentId?: string;
  goBack?: boolean;
};

export interface NavigationPayload {
  data?: NavigationPayloadData;
  options?: NavigationPayloadOptions,
}
