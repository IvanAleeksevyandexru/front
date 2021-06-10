import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { LocationService } from './location.service';
import { WINDOW_PROVIDERS } from '../../providers/window.provider';

describe('LocationService', () => {
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationService,
        WINDOW_PROVIDERS
      ],
    });
    delete window.location;
    window.location = {
      href: null,
      reload: jest.fn()
    } as unknown as Location;
    locationService = TestBed.inject(LocationService);
  });

  it('should extend Location class', () => {
    expect(locationService).toBeInstanceOf(Location);
  });

  describe('href()', () => {
    it('should call Location.go() method if isInner is TRUE', () => {
      const goFn = jest.spyOn(locationService, 'go');

      locationService.href('/abc', true);

      expect(goFn).toBeCalledTimes(1);
      expect(goFn).toBeCalledWith('/abc');
    });

    it('should set location.href if isInner is FALSE', () => {
      const goFn = jest.spyOn(locationService, 'go');

      locationService.href('/abc');

      expect(window.location.href).toBe('/abc');
    });
  });

  it('getHref()', () => {
    window.location.href = '/abc';

    expect(locationService.getHref()).toBe('/abc');
  });

  it('reload()', () => {
    locationService.reload();
    expect(window.location.reload).toBeCalledTimes(1);
  });

  describe('deleteParam()', () => {
    it('should do nothing if params is empty', () => {
      window.location.search = '';
      window.location.pathname = '/some/path';

      const replaceStateFn = jest.spyOn(locationService, 'replaceState');

      locationService.deleteParam('a', 'e');

      expect(replaceStateFn).not.toBeCalled();
    });

    it('should replace state if params is not empty', () => {
      window.location.search = '?a=b&c=d&e=f';
      window.location.pathname = '/some/path';

      const replaceStateFn = jest.spyOn(locationService, 'replaceState');

      locationService.deleteParam('a', 'e');

      expect(replaceStateFn).toBeCalledTimes(1);
      expect(replaceStateFn).toBeCalledWith('/some/path', 'c=d');
    });
  });
});
