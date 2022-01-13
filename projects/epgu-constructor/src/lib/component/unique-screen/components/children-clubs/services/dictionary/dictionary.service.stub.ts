import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DictionaryCcServiceStub {
  public focusData$ = of(null);

  public municipalitiesList$ = of(null);

  public getProgram(
    uuid: string,
    nextSchoolYear: boolean,
  ): Observable<{ uuid: string; nextSchoolYear: boolean }> {
    return of({ uuid, nextSchoolYear });
  }
}
