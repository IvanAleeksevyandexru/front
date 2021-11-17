import { TestBed } from '@angular/core/testing';
import { DisplayDto } from '@epgu/epgu-constructor-types';

import { PrevButtonNavigationService } from './prev-button-navigation.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { NavigationService } from '../navigation/navigation.service';
import { NavigationServiceStub } from '../navigation/navigation.service.stub';

describe('PrevButtonNavigationService', () => {
  let service: PrevButtonNavigationService;
  let navigationService: NavigationService;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PrevButtonNavigationService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(PrevButtonNavigationService);
    navigationService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
  });

  it('should call redirectToHome', () => {
    jest
      .spyOn(screenService, 'display', 'get')
      .mockReturnValue({ firstScreen: true } as DisplayDto);
    const spy = jest.spyOn(navigationService, 'redirectToHome');
    service.prev();
    expect(spy).toBeCalled();
  });

  it('should call prev', () => {
    jest
      .spyOn(screenService, 'display', 'get')
      .mockReturnValue({ firstScreen: false } as DisplayDto);
    const spy = jest.spyOn(navigationService, 'prev');
    service.prev();
    expect(spy).toBeCalled();
  });
});
