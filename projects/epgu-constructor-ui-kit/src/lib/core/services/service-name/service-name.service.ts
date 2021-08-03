import { Injectable } from '@angular/core';

@Injectable()
export class ServiceNameService {

  /**
   * Returns url separated by subdirectories and query parameters
   * @param url
   */
  public getSplittedUrl(url: string): string[] {
    const splitByQueryParam = url.split('?');
    const splitByDirLocation = splitByQueryParam[0].split('/');

    return splitByDirLocation;
  }

  /**
   * Returns modified service name in camelCase format
   * Example:
   * https://www.gosuslugi.ru/600101/1/form-item -> form-item -> formItem
   * https://www.gosuslugi.ru/600101/1/form_item -> form_item -> formItem
   * https://www.gosuslugi.ru/600101/1/form -> form -> form
   * @param url
   * @param sliceFrom
   */
  public getServiceName(url: string, sliceFrom: number = 3): string {
    const numRegex = /^\d+$/;
    const splittedUrl = this.getSplittedUrl(url);

    let preparedArray = this.sliceArrayFromRight(splittedUrl, sliceFrom);

    if (numRegex.test(preparedArray[0])) {
      preparedArray = this.sliceArrayFromRight(preparedArray, sliceFrom, false);
    }

    preparedArray = preparedArray.map((urlPath) => (numRegex.test(urlPath) ? '' : urlPath));

    const serviceName = preparedArray.join('-');
    const camelCasedServiceName = serviceName.replace(/(?:^_-\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    });
    const cleanCamelCasedServiceName = camelCasedServiceName.replace(/[-_\s]+/g, '');

    return `${cleanCamelCasedServiceName}Service`;
  }

  /**
   * Returns a boolean value if url is an instance of a string type
   * @param url
   */
  public isValidHttpUrl(url: string | undefined): boolean {
    return url && typeof url === 'string';
  }

  private sliceArrayFromRight(arr: string[], from: number, includeFirst: boolean = true): string[] {
    return arr.slice(Math.max(arr.length - from, includeFirst ? 0 : 1));
  }
}
