export enum FormPlayerNavigation {
  'NEXT' = 'getNextStep',
  'PREV' = 'getPrevStep',
}

export interface NavigationPayload {
  data?: any,
  options?: any,
}
