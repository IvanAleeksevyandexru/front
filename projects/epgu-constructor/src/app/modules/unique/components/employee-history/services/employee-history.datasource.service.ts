import { Injectable } from '@angular/core';
import { IEmployeeHistoryDataSource } from '../../../../../../interfaces/employee-history.interface';
import { TGender } from '../../../../../../interfaces/epgu.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryDatasourceService {

  constructor() { }

  public getDataSourceByGender(gender: TGender): Array<IEmployeeHistoryDataSource> {
    return [
      {
        label: `Я учил${gender === 'male' ? 'ся' : 'ась'}`,
        value: 0,
        position: 'Учащийся или студент',
        place: 'Место учебы без сокращений и аббревиатур',
      },
      {
        label: `Я работал${gender === 'male' ? '' : 'а'}`,
        value: 1,
        position: 'Ваша должность',
        place: 'Место работы без сокращений и аббревиатур',
      },
      {
        label: `Я служил${gender === 'male' ? '' : 'а'}`,
        value: 2,
        position: 'Воинская должность и звание',
        place: 'Номер части и род (вид) войск',
      },
      {
        label: `Я не работал${gender === 'male' ? '' : 'а'}`,
        value: 3,
        position: '',
        place: '',
      },
    ];
  }
}
