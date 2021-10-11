import { Injectable } from '@angular/core';
import { get } from 'lodash';

@Injectable()
export class InterpolationService {
  public variableRegExp = /\${(\w(\w|\d|_|\.)*)}/gi;

  public interpolateObject(source: object, variables: object, keepVariables = true): object {
    return Object.entries(source).reduce((result, [key, value]) => {
      result[key] =
        typeof value === 'string'
          ? this.interpolateString(value, variables, '', keepVariables)
          : value;
      return result;
    }, {});
  }

  public interpolateString(
    stringWithVariables: string,
    variables: object,
    defaultValue: string = '',
    keepVariables = true,
  ): string {
    return stringWithVariables.replace(this.variableRegExp, (match: string, path: string): string =>
      get(variables, path, keepVariables ? match : defaultValue),
    );
  }
}
