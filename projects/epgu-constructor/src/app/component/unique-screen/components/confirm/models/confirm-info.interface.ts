export interface ConfirmInfoInterface {
  place: string;
  address: string;
  ceremonyType: string;
  time: string;
  label: string;
  timer?: {
    start: string;
    finish: string;
    warningTime: number;
  };
}
