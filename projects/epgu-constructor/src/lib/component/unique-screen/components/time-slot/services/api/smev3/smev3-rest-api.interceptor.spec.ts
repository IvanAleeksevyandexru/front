import { TestBed } from '@angular/core/testing';
import { Smev3RestApiInterceptor } from './smev3-rest-api.interceptor';
import { TimeSlotErrorService } from '../../error/time-slot-error.service';
import { Smev3RestApiService } from './smev3-rest-api.service';
import { Smev3RestApiServiceStub } from './smev3-rest-api.service.stub';

import { SmevSlotsResponseInterface, TimeSlotRequestType } from '../../../typings';
import { TimeSlotSmev3StateService } from '../../smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../../smev3-state/time-slot-smev3-state.service.stub';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotsConstants } from '../../../../time-slots/time-slots.constants';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';

describe('Smev3RestApiInterceptor', () => {
  let service: Smev3RestApiInterceptor;
  let errorService: TimeSlotErrorService;
  let apiService: Smev3RestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Smev3RestApiInterceptor,
        { provide: Smev3RestApiService, useClass: Smev3RestApiServiceStub },
        { provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        TimeSlotErrorService,
        TimeSlotsConstants,
      ],
    });
    errorService = TestBed.inject(TimeSlotErrorService);
    apiService = TestBed.inject(Smev3RestApiService);
    jest.spyOn(apiService, 'getType').mockReturnValue(TimeSlotRequestType.list);
    service = TestBed.inject(Smev3RestApiInterceptor);
  });

  describe('base', () => {
    it('should be isValidRequest', () => {
      apiService.urlPrefix = 'test';
      expect(service.isValidRequest({ url: 'test' } as HttpRequest<unknown>)).toBe(true);
    });

    it('should be handleResponse', (done) => {
      jest.spyOn(apiService, 'hasError').mockReturnValue(true);
      jest.spyOn(service, 'setErrorForResponse');

      service
        .handleResponse(
          ({} as unknown) as HttpRequest<unknown>,
          ({
            body: {},
          } as unknown) as HttpResponse<SmevSlotsResponseInterface>,
        )
        .subscribe(() => {
          expect(service.setErrorForResponse).toHaveBeenCalled();
          done();
        });
    });

    it('should be setErrorForResponse', () => {
      jest.spyOn(errorService, 'setError');

      const detailError = { errorMessage: 'test', errorCode: 1 };
      const error = { errorDetail: detailError };
      service.setErrorForResponse(
        ({} as unknown) as HttpRequest<unknown>,
        ({
          body: { error },
        } as unknown) as HttpResponse<SmevSlotsResponseInterface>,
      );
      expect(errorService.setError).toHaveBeenCalledWith(TimeSlotRequestType.list, 'test', 1);
    });

    it('should be handleResponseError', () => {
      jest.spyOn(errorService, 'setError');
      service.handleResponseError(
        ({} as unknown) as HttpRequest<unknown>,
        ({
          error: { code: 1, message: 'test' },
        } as unknown) as HttpErrorResponse,
      );

      expect(errorService.setError).toHaveBeenCalledWith(TimeSlotRequestType.list, 'test', 1);
    });
  });
});
