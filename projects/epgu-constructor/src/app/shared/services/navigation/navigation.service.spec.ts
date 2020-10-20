import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';
import { ConfigService } from '../../../config/config.service';

xdescribe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: ConfigService, useClass: ConfigServiceStub },
      ]
    });
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
