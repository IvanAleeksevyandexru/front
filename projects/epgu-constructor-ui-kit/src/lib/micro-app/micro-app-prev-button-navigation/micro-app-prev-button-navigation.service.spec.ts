import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { MicroAppPrevButtonNavigationService } from './micro-app-prev-button-navigation.service';
import { MicroAppNavigationServiceStub } from '../micro-app-navigation/micro-app-navigation.service.stub';
import { MicroAppNavigationService } from '../micro-app-navigation/micro-app-navigation.service';

describe('MicroAppPrevButtonNavigationService', () => {
  let service: MicroAppPrevButtonNavigationService;
  let appNavigationService: MicroAppNavigationService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        MicroAppPrevButtonNavigationService,
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(MicroAppPrevButtonNavigationService);
    appNavigationService = TestBed.inject(MicroAppNavigationService);
  });

  it('should call prev', () => {
    const spy = jest.spyOn(appNavigationService, 'prev');
    service.prev();
    expect(spy).toBeCalledWith();
  });
});
