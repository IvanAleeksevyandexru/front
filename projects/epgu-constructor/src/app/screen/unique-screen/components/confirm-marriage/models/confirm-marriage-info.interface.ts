export interface ConfirmMarriageInfoInterface {
  place: string;
  address: string;
  ceremonyType: string;
  time: string;
  timer?: {
    start: string;
    finish: string;
  };
  ReservationPeriod?: number;
}
