import { Injectable } from '@angular/core';
import { get } from 'lodash';

@Injectable()
export class InterpolationService {
  public variableRegExp = /\${(\w(\w|\d|_|\.)*)}/gi;

  public interpolateRecursive(source: unknown, variables: object, keepVariables = true): unknown {
    if (Array.isArray(source)) {
      return source.map(item => this.interpolateRecursive(item, variables, keepVariables));
    }

    if (typeof source === 'object') {
      return Object.entries(source).reduce((result, [key, value]) => {
        result[key] = this.interpolateRecursive(value, variables, keepVariables);
        return result;
      }, {});
    }

    if (typeof source === 'string') {
      return this.interpolateString(source, variables, '', keepVariables);
    }

    return source;
  }

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
