import { Injectable } from '@angular/core';
import { EmployeeHistoryDataSource } from '../employee-history.types';
import { Gender } from '@epgu/epgu-constructor-types';

@Injectable()
export class EmployeeHistoryDataSourceService {
  public dataSource: EmployeeHistoryDataSource[];

  public getDataSourceByGender(gender: Gender = Gender.male): void {
    this.dataSource = [
      {
        label: `Я учил${gender === Gender.male ? 'ся' : 'ась'}`,
        type: 'student',
        position: '',
        place: 'Место учебы без сокращений и аббревиатур',
        address: 'Юридический адрес полностью, включая регион и город',
      },
      {
        label: `Я работал${gender === Gender.male ? '' : 'а'}`,
        type: 'employed',
        position: 'Ваша должность',
        place: 'Место работы без сокращений и аббревиатур',
        address: 'Юридический адрес полностью, включая регион и город',
      },
      {
        label: `Я служил${gender === Gender.male ? '' : 'а'}`,
        type: 'military',
        position: 'Воинская должность и звание',
        place: 'Номер части и род (вид) войск',
        address: 'Юридический адрес полностью, включая регион и город',
      },
      {
        label: `Я не работал${gender === Gender.male ? '' : 'а'} и не учил${
          gender === Gender.male ? 'ся' : 'ась'
        }`,
        type: 'unemployed',
        position: '',
        place: '',
        address:
          'Адрес постоянной регистрации (прописки) или временной регистрации (место пребывания) в этот период',
      },
    ];
  }
}
