import { Injectable } from '@angular/core';
import { EmployeeHistoryDataSource } from '../../../../../../interfaces/employee-history.interface';
import { Gender } from '../../../../../../interfaces/epgu.service.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryDatasourceService {

  constructor() { }

  public getDataSourceByGender(gender: Gender): Array<EmployeeHistoryDataSource> {
    return [
      {
        label: `Я учил${gender === 'male' ? 'ся' : 'ась'}`,
        type: 'student',
        position: 'Учащийся или студент',
        place: 'Место учебы без сокращений и аббревиатур',
      },
      {
        label: `Я работал${gender === 'male' ? '' : 'а'}`,
        type: 'employed',
        position: 'Ваша должность',
        place: 'Место работы без сокращений и аббревиатур',
      },
      {
        label: `Я служил${gender === 'male' ? '' : 'а'}`,
        type: 'military',
        position: 'Воинская должность и звание',
        place: 'Номер части и род (вид) войск',
      },
      {
        label: `Я не работал${gender === 'male' ? '' : 'а'}`,
        type: 'unemployed',
        position: '',
        place: '',
      },
    ];
  }
}
