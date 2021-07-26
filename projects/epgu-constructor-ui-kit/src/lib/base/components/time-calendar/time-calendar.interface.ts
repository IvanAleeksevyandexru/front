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

export interface ErrorTemplate {
  header: string; description: string
}
