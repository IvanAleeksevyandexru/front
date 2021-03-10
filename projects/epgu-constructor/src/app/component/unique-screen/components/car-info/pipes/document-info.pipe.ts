import { Pipe, PipeTransform } from '@angular/core';
import { Document } from '../models/car-info.interface';
@Pipe({
  name: 'documentInfo'
})
export class DocumentInfoPipe implements PipeTransform {

  transform(document: Document): string {
    const { seriesAndNumber = null, issueDate = null } = document;
    return seriesAndNumber && issueDate ? `${seriesAndNumber}, дата выдачи ${issueDate}`: null;
  }

}
