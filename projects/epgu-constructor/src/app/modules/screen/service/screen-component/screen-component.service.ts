import { Injectable } from '@angular/core';
// import {Subject} from 'rxjs';

@Injectable()
export class ScreenComponentService {

  // clickSubmit = new Subject();
  // clickSubmit$ = this.clickSubmit.asObservable();

  // отправляемые данные, при рендеринге компонента
  // инициализируем данные, при редактировании обновляем;
  dataToSend: any;
  isValid = true;

  constructor() { }
}
