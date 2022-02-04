export interface Trobber {
  message: string;
  timeout: number;
}

export interface LogicAfterValidationComponents {
  attrs: {
    onload: {
      trobber: Trobber;
    };
  };
}
