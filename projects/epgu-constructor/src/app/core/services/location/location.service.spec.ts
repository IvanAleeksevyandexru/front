import { TestBed } from '@angular/core/testing';

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
    window.location = { href: null } as Location;
    locationService = TestBed.inject(LocationService);
  });

  it('test href', () => {
    locationService.href('/');
    expect(locationService.getHref()).toBe('/');
  });
});
