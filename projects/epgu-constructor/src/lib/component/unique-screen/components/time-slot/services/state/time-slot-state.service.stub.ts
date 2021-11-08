import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class TimeSlotStateServiceStub {
  get day$(): Observable<Date> {
    return of(new Date());
  }
  showModal() {}

  setMonth() {}

  setMonths() {}

  setList() {}

  setSlot() {}

  setDay() {}

  progressStart() {}

  progressEnd() {}

  clearSlot() {}

  clearDay() {}

  setResult() {}
}
