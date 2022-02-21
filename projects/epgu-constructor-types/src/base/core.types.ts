export type KeyValueMap = {
  [key: string]: string | number;
};

export type ValidationServiceContext = {
  healthService?: any;
  cookieService?: any;
  currentAnswersService?: any;
  jsonHelperService?: any;
};
