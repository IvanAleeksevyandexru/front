import { Injectable } from '@angular/core';
import { DisplayDto } from 'epgu-constructor-types/dist/base/screen';

@Injectable()
export class HtmlRemoverService {
  public hasHtmlRegExp = /(<([^>]+)>)/ig;

  constructor() {}

  public delete(display: DisplayDto): DisplayDto {
    if (!display) {
      return;
    }
    const clearedDisplay = JSON.parse(JSON.stringify(display));
    const recursiveDeleteNodesWithHtml = (obj: DisplayDto): DisplayDto => {
      for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
          const objProperty = obj[property];
          if (typeof objProperty == 'object') {
            recursiveDeleteNodesWithHtml(objProperty);
          } else {
            if (typeof objProperty === 'string' && this.hasHtmlRegExp.test(objProperty)) {
              delete obj[property];
            }
          }
        }
      }

      return obj;
    };

    return recursiveDeleteNodesWithHtml(clearedDisplay);
  }
}
