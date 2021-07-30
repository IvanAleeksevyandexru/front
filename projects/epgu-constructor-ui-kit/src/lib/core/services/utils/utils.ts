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
