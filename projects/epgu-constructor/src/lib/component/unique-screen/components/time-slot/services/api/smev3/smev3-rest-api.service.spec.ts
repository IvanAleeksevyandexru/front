import { TestBed } from '@angular/core/testing';

import { Smev3RestApiService } from './smev3-rest-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ErrorInterface, TimeSlotCancelRequest, TimeSlotRequestType } from '../../../typings';

describe('Smev3RestApiService', () => {
  let service: Smev3RestApiService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Smev3RestApiService, { provide: ConfigService, useClass: ConfigServiceStub }],
    });
    service = TestBed.inject(Smev3RestApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('base', () => {
    it('should be getType', () => {
      expect(service.getType('slots')).toBe(TimeSlotRequestType.list);
      expect(service.getType('book')).toBe(TimeSlotRequestType.book);
      expect(service.getType('cancel')).toBe(TimeSlotRequestType.cancel);
    });
    it('should be hasError', () => {
      const detail = { errorMessage: '1', errorCode: 1 };
      expect(service.hasError(({ errorDetail: detail } as unknown) as ErrorInterface)).toBe(true);
    });
    it('should be getList', () => {
      service.getList({}).subscribe((v) => {
        expect(v).toEqual([]);
      });
      httpTestingController
        .expectOne(`${service.urlPrefix}/${service.listPath}`)
        .flush({ slots: [] });
    });
    it('should be book', () => {
      const test = { bookId: 'test' };
      service.book({}).subscribe((v) => {
        expect(v).toEqual(test);
      });
      httpTestingController
        .expectOne(`${service.urlPrefix}/${service.bookPath}?srcSystem=BETA`)
        .flush(test);
    });
    it('should be cancel', () => {
      const test = { bookId: 'test' };
      service.cancel(({} as unknown) as TimeSlotCancelRequest).subscribe((v) => {
        expect(v).toEqual(test);
      });
      httpTestingController.expectOne(`${service.urlPrefix}/${service.cancelPath}`).flush(test);
    });
  });
});
