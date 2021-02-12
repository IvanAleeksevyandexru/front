import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passportInfo'
})
export class PassportInfoPipe implements PipeTransform {

  transform(series: string, number: string, issueDate: string ): string {
    return number && series && issueDate ? `${series} ${number}, дата выдачи ${issueDate}`: null;
  }

}
