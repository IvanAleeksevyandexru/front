import { TestBed } from '@angular/core/testing';

import { CachedAnswersService } from './cached-answers.service';
import { ObjectHelperService, DownloadService } from '@epgu/epgu-constructor-ui-kit';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';

describe('CachedAnswersService', () => {
  let service: CachedAnswersService;

  let localStorageService: LocalStorageServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CachedAnswersService,
        DownloadService,
        ObjectHelperService,
        JsonHelperService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
    service = TestBed.inject(CachedAnswersService);

    localStorageService = TestBed.inject(LocalStorageService) as LocalStorageServiceStub;
  });

  it('getCachedValueFromLocalStorage()', () => {
    jest.spyOn(localStorageService, 'get').mockReturnValue(null);
    expect(service.getCachedValueFromLocalStorage('someId')).toBeNull();

    jest.spyOn(localStorageService, 'get').mockReturnValue({
      anotherId: {
        foo: 'bar',
      },
    });
    expect(service.getCachedValueFromLocalStorage('someId')).toBeNull();

    expect(service.getCachedValueFromLocalStorage('anotherId')).toBe(
      JSON.stringify({
        foo: 'bar',
      }),
    );
  });

  it('setValueToLocalStorage()', () => {
    jest.spyOn(localStorageService, 'get').mockReturnValue(null);
    const setFn = jest.spyOn(localStorageService, 'set');
    service.setValueToLocalStorage('someId', {
      a: 'b',
    });

    expect(setFn).toBeCalledTimes(1);
    expect(setFn).toBeCalledWith('cachedAnswers', {
      someId: {
        a: 'b',
      },
    });
    setFn.mockClear();

    jest.spyOn(localStorageService, 'get').mockReturnValue({
      anotherId: {
        c: 'd',
      },
    });
    service.setValueToLocalStorage('someId', {
      a: 'b',
    });
    expect(setFn).toBeCalledTimes(1);
    expect(setFn).toBeCalledWith('cachedAnswers', {
      anotherId: {
        c: 'd',
      },
      someId: {
        a: 'b',
      },
    });
  });

  it('removeValueFromLocalStorage()', () => {
    const setFn = jest.spyOn(localStorageService, 'set');

    jest.spyOn(localStorageService, 'get').mockReturnValue(null);
    service.removeValueFromLocalStorage('component1');
    expect(setFn).not.toBeCalled();

    jest.spyOn(localStorageService, 'get').mockReturnValue({
      component1: 'some value',
      component2: 'another value',
    });

    service.removeValueFromLocalStorage('component1');
    expect(setFn).toBeCalledTimes(1);
    expect(setFn).toBeCalledWith('cachedAnswers', {
      component2: 'another value',
    });
  });
});
