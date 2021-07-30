
/**
 * Возвращает true, если объекты равны при сравнии
 * @param prev - объект 1
 * @param next - объект 2
 */
export function isEqualObj<T>(prev: T, next: T): boolean {
  return JSON.stringify(prev) === JSON.stringify(next);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isBoolean(value: any): boolean {
  return typeof value === 'boolean';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isUndefined(value: any): boolean {
  return typeof value === 'undefined';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toBoolean(value: any): boolean {
  return isBoolean(value) ? value : value === 'true';
}

/**
 * Декоратор метода, заменяющий аргументы функции, при совпадении с условием
 * @param replaceBy - чем заменяется значение
 * @param compareFn - функция сравнения с аргументом
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function replaceArguments(replaceBy: any, compareFn: (arg: any) => boolean) {
  return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args): any {
      const replacedArgs = args.map((arg) => (compareFn(arg) ? replaceBy : arg));
      return originalMethod.apply(this, replacedArgs);
    };
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
