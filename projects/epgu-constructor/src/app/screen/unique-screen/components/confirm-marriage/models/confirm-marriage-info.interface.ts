export interface ConfirmMarriageInfoInterface {
  place: ConfirmMarriageInfoValueInterface<string>;
  address: ConfirmMarriageInfoValueInterface<string>;
  ceremonyType: ConfirmMarriageInfoValueInterface<string>;
  time: ConfirmMarriageInfoValueInterface<Date>;
  timer: {
    start: ConfirmMarriageInfoValueInterface<Date>;
    finish: ConfirmMarriageInfoValueInterface<Date>;
  };
}

interface ConfirmMarriageInfoValueInterface<T> {
  label: string;
  type: string;
  value: T;
}
