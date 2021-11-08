import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TimeSlotSmev3ServiceStub {
  set area(area: string) {}
  get area$(): Observable<string> {
    return of(null);
  }
  reloadStore() {}
  getBookRequest() {}
  getAddress() {}
  book() {}
  cancel() {}
  createSlot() {}
  createMap() {}
  createRequest() {}
  paramsFilter() {}
  getSlotListByDate() {}
  addBookedTimeSlotToList() {}
  isBookedDepartment() {}
  clearMessage() {}
}
