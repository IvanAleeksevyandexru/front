import {SlotInterface} from './slot.interface';

export interface TimeSlotsService<T extends SlotInterface> {
  init(data: any);
  getCurrentYear(): number;
  getCurrentMonth(): number;
  getAvailableMonths(): string[];
  isDateLocked(date: Date): boolean;
  getAvailableSlots(selectedDay: Date): T[];
  getBookedSlot(): any;
  book(selectedSlot: T);
  hasError(): boolean;
  getErrorMessage(): string;
}
