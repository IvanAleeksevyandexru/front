import { Injectable } from '@angular/core';
import { EmployeeHistoryDataSource } from '../employee-history.types';
import { Gender } from '../../../../../shared/types/gender';


@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryDatasourceService {

  constructor() { }

  public getDataSourceByGender(gender: Gender): Array<EmployeeHistoryDataSource> {
    return [
      {
        label: `Я учил${gender === Gender.male ? 'ся' : 'ась'}`,
        type: 'student',
        position: 'Учащийся или студент',
        place: 'Место учебы без сокращений и аббревиатур',
      },
      {
        label: `Я работал${gender === Gender.male ? '' : 'а'}`,
        type: 'employed',
        position: 'Ваша должность',
        place: 'Место работы без сокращений и аббревиатур',
      },
      {
        label: `Я служил${gender === Gender.male ? '' : 'а'}`,
        type: 'military',
        position: 'Воинская должность и звание',
        place: 'Номер части и род (вид) войск',
      },
      {
        label: `Я не работал${gender === Gender.male ? '' : 'а'}`,
        type: 'unemployed',
        position: '',
        place: '',
      },
    ];
  }
}
