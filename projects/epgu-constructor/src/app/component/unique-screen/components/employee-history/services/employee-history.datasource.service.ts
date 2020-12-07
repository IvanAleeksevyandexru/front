import { Injectable } from '@angular/core';
import { EmployeeHistoryDataSource } from '../employee-history.types';
import { Gender } from '../../../../../shared/types/gender';

@Injectable()
export class EmployeeHistoryDatasourceService {
  constructor() {}

  public getDataSourceByGender(gender: Gender = Gender.male): Array<EmployeeHistoryDataSource> {
    return [
      {
        label: `Я учил${gender === Gender.male ? 'ся' : 'ась'}`,
        type: 'student',
        position: '',
        place: 'Место учебы без сокращений и аббревиатур',
        placeHint: 'Как в дипломе или аттестате',
        address: 'Юридический адрес полностью, включая регион и город',
      },
      {
        label: `Я работал${gender === Gender.male ? '' : 'а'}`,
        type: 'employed',
        position: 'Ваша должность',
        positionHint: 'Если вы ИП, указывайте — Индивидуальный предприниматель',
        place: 'Место работы без сокращений и аббревиатур',
        placeHint: 'Как в трудовой. Если вы ИП, указывайте — Индивидуальный предприниматель ФИО',
        address: 'Юридический адрес полностью, включая регион и город',
      },
      {
        label: `Я служил${gender === Gender.male ? '' : 'а'}`,
        type: 'military',
        position: 'Воинская должность и звание',
        place: 'Номер части и род (вид) войск',
        placeHint: 'Как в военном билете',
        address: 'Юридический адрес полностью, включая регион и город',
      },
      {
        label: `Я не работал${gender === Gender.male ? '' : 'а'}`,
        type: 'unemployed',
        position: '',
        place: '',
        address:
          'Адрес постоянной регистрации (прописки) или временной регистрации (место пребывания) в этот период',
      },
    ];
  }
}
