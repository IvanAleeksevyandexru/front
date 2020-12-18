import { Injectable } from '@angular/core';
import { DisplayDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Injectable()
export class HtmlRemoverService {
  public hasHtmlRegExp = /(<([^>]+)>)/ig;

  constructor() {}

  public delete(display: DisplayDto): DisplayDto {
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

    return recursiveDeleteNodesWithHtml(display);
  }
}
