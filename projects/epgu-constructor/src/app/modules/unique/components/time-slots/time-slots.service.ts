import {Observable} from 'rxjs';

export interface TimeSlotsService {
  init(data: any): Observable<any>;
  getCurrentYear(): number;
  getCurrentMonth(): number;
  getAvailableMonths(): string[];
  isDateLocked(date: Date): boolean;
  getAvailableSlots(selectedDay: Date): Observable<any[]>;
  getBookedSlot(): any;
  book(selectedSlot: any): Observable<any>;
  hasError(): boolean;
  getErrorMessage(): string;
}
