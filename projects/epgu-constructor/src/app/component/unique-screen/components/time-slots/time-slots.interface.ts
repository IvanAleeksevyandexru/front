import { Observable } from 'rxjs';
import {
  DepartmentInterface,
  SlotInterface,
  SmevBookResponseInterface,
  TimeSlotValueInterface
} from './time-slots.types';

export interface TimeSlotsServiceInterface {
  BOOKING_NAMESPACE: string;
  bookId: string;
  department: DepartmentInterface;
  init(data: TimeSlotValueInterface): Observable<void>;
  getCurrentYear(): number;
  getCurrentMonth(): number;
  getAvailableMonths(): string[];
  isDateLocked(date: Date): boolean;
  getAvailableSlots(selectedDay: Date): Observable<SlotInterface[]>;
  getBookedSlot(): SlotInterface;
  setBookedSlot(bookedSlot: SlotInterface): void;
  checkBooking(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface>;
  book(selectedSlot: SlotInterface): Observable<SmevBookResponseInterface>;
  hasError(): boolean;
  getErrorMessage(): string;
}

