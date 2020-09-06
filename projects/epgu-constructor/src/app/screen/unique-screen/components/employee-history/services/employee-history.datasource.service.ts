import { Injectable } from '@angular/core';
import { EmployeeHistoryDataSource } from '../employee-history.types';
import { Gender } from '../../../../screen.types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryDatasourceService {

  constructor() { }

  public getDataSourceByGender(gender: Gender): Array<EmployeeHistoryDataSource> {
    return [
      {
        label: `Я учил${gender === 'M' ? 'ся' : 'ась'}`,
        type: 'student',
        position: 'Учащийся или студент',
        place: 'Место учебы без сокращений и аббревиатур',
      },
      {
        label: `Я работал${gender === 'M' ? '' : 'а'}`,
        type: 'employed',
        position: 'Ваша должность',
        place: 'Место работы без сокращений и аббревиатур',
      },
      {
        label: `Я служил${gender === 'M' ? '' : 'а'}`,
        type: 'military',
        position: 'Воинская должность и звание',
        place: 'Номер части и род (вид) войск',
      },
      {
        label: `Я не работал${gender === 'M' ? '' : 'а'}`,
        type: 'unemployed',
        position: '',
        place: '',
      },
    ];
  }
}
