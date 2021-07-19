export interface IDay {
  date: Date;
  number: number;
  classes?: {
    [key: string]: boolean;
  };
}
export interface SlotInterface {
  slotId: string;
  slotTime: Date;
  timezone: string;
  areaId?: string;
}
