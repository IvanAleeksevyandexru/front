export interface ConfirmationModalBaseButton {
  label: string;
  color?: '' | 'white' | 'transparent';
  loader?: boolean;
  handler?: Function;
  value?: string | boolean;
}
