import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { AppPrevButtonNavigationService } from './app-prev-button-navigation.service';
import { AppNavigationServiceStub } from '../app-navigation/app-navigation.service.stub';
import { AppNavigationService } from '../app-navigation/app-navigation.service';

describe('AppPrevButtonNavigationService', () => {
  let service: AppPrevButtonNavigationService;
  let appNavigationService: AppNavigationService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        AppPrevButtonNavigationService,
        { provide: AppNavigationService, useClass: AppNavigationServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AppPrevButtonNavigationService);
    appNavigationService = TestBed.inject(AppNavigationService);
  });

  it('should call prev', () => {
    const spy = jest.spyOn(appNavigationService, 'prev');
    service.prev();
    expect(spy).toBeCalledWith();
  });
});
