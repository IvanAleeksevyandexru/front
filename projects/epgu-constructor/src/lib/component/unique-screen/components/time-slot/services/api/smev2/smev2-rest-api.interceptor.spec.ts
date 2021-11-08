import { TestBed } from '@angular/core/testing';

import { Smev2RestApiInterceptor } from './smev2-rest-api.interceptor';
import { TimeSlotErrorService } from '../../error/time-slot-error.service';
import { Smev2RestApiService } from './smev2-rest-api.service';
import { Smev2RestApiServiceStub } from './smev2-rest-api.service.stub';
import { TimeSlotSmev3StateServiceStub } from '../../smev3-state/time-slot-smev3-state.service.stub';
import { TimeSlotSmev3StateService } from '../../smev3-state/time-slot-smev3-state.service';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotsConstants } from '../../../../time-slots/time-slots.constants';
import { TimeSlotRequestType } from '../../../typings';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { DictionaryResponse } from '../../../../../../../shared/services/dictionary/dictionary-api.types';
import { HttpTestingController } from '@angular/common/http/testing';

describe('Smev2RestApiInterceptor', () => {
  let service: Smev2RestApiInterceptor;
  let errorService: TimeSlotErrorService;
  let apiService: Smev2RestApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Smev2RestApiService, useClass: Smev2RestApiServiceStub },
        TimeSlotErrorService,
        { provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        Smev2RestApiInterceptor,
        TimeSlotsConstants,
      ],
    });
    service = TestBed.inject(Smev2RestApiInterceptor);
    errorService = TestBed.inject(TimeSlotErrorService);
    apiService = TestBed.inject(Smev2RestApiService);
    jest.spyOn(apiService, 'getType').mockReturnValue(TimeSlotRequestType.list);
  });

  describe('base', () => {
    it('should be isValidRequest', () => {
      apiService.path = 'test';
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
          } as unknown) as HttpResponse<DictionaryResponse>,
        )
        .subscribe(() => {
          expect(service.setErrorForResponse).toHaveBeenCalled();
          done();
        });
    });

    it('should be setErrorForResponse', () => {
      jest.spyOn(errorService, 'setError');
      const error = { message: 'test', code: 1 };
      service.setErrorForResponse(({
        body: { error },
      } as unknown) as HttpResponse<DictionaryResponse>);
      expect(errorService.setError).toHaveBeenCalledWith(TimeSlotRequestType.list, 'test', 1);
    });

    it('should be handleResponseError', () => {
      jest.spyOn(errorService, 'setError');
      service.handleResponseError(({
        error: { code: 1, message: 'test' },
      } as unknown) as HttpErrorResponse);

      expect(errorService.setError).toHaveBeenCalledWith(TimeSlotRequestType.list, 'test', 1);
    });
  });
});
