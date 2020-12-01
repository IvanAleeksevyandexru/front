import { Observable } from 'rxjs';
import {
  SlotInterface,
  SmevBookResponseInterface,
  SmevSlotInterface,
  TimeSlotValueInterface
} from './time-slots.types';

export interface TimeSlotsServiceInterface {
  init(data: TimeSlotValueInterface): Observable<void>;
  getCurrentYear(): number;
  getCurrentMonth(): number;
  getAvailableMonths(): string[];
  isDateLocked(date: Date): boolean;
  getAvailableSlots(selectedDay: Date): Observable<SmevSlotInterface[]>;
  getBookedSlot(): SlotInterface;
  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface>;
  book(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface>;
  hasError(): boolean;
  getErrorMessage(): string;
}

