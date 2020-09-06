export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export interface NavigationPayload {
  data?: any,
  options?: {
    componentId?: string;
    goBack?: boolean;
  },
}
