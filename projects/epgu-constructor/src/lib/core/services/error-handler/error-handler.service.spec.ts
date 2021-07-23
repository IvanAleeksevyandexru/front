import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ErrorHandlerService, ModalFailureType } from './error-handler.service';
import {
  ConfigService,
  ConfigServiceStub,
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../navigation/navigation.service';
import { NavigationServiceStub } from '../navigation/navigation.service.stub';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ErrorHandlerService,
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ErrorHandlerService);
  });

  describe('response', () => {
    it('dictionary/mzrf_lpu_equeue_smev3', () => {
      const response = new HttpResponse({
        status: 200,
        url: 'dictionary/mzrf_lpu_equeue_smev3',
        body: {
          error: {
            code: 0,
            message: 'operation crashed',
          },
          items: [
            {
              value: 'FAILURE',
            },
          ],
        },
      });

      jest.spyOn(service, 'showModalFailure');
      service.handleResponse(response);
      expect(service.showModalFailure).toHaveBeenCalledWith(
        'Время сессии истекло, перейдите к началу',
        true,
        ModalFailureType.SESSION,
      );
    });
  });
});
