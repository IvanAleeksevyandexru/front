import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { waitForAsync, TestBed, fakeAsync } from '@angular/core/testing';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { brakBookRequest } from './mocks/mock-time-slots';
import { Smev3TimeSlotsRestService } from './smev3-time-slots-rest.service';

describe('FormPlayerApiService', () => {
  const slotReqBody = {
    organizationId: ['R7700018'],
    caseNumber: '1091204272',
    serviceId: ['ЗагсБрак'],
    eserviceId: '10000057526',
    routeNumber: '00000000002',
    attributes: [
      { name: 'SolemnRegistration', value: false },
      { name: 'SlotsPeriod', value: '2021-04' },
    ],
  };
  let smevService: Smev3TimeSlotsRestService;
  let http: HttpTestingController;
  const responseMock = [42];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Smev3TimeSlotsRestService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    });
  });

  beforeEach(() => {
    smevService = TestBed.inject(Smev3TimeSlotsRestService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(waitForAsync(() => http.verify()));

  describe('getTimeSlots()', () => {
    it('should call getTimeSlots with post method', fakeAsync(() => {
      smevService.getTimeSlots(slotReqBody).subscribe((response) => {
        expect(response).toBe(responseMock);
      });
      const req = http.expectOne('/agg/slots');
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
    }));

    it('should call getTimeSlots with body', fakeAsync(() => {
      smevService
        .getTimeSlots(slotReqBody)
        .subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne('/agg/slots');
      const { body } = req.request;
      expect(body).toEqual(slotReqBody);
      req.flush(responseMock);
    }));
  });

  describe('bookTimeSlot()', () => {
    it('should call bookTimeSlot with post method', fakeAsync(() => {
      smevService.bookTimeSlot(brakBookRequest).subscribe((response) => {
        expect(response).toBe(responseMock);
      });
      const req = http.expectOne('/agg/book?srcSystem=BETA');
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
    }));

    it('should call bookTimeSlot with body', fakeAsync(() => {
      smevService
        .bookTimeSlot(brakBookRequest)
        .subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne('/agg/book?srcSystem=BETA');
      const { body } = req.request;
      expect(body).toEqual(brakBookRequest);
      req.flush(responseMock);
    }));
  });

  describe('cancelSlot()', () => {
    const cancelRequestBody = {
      eserviceId: 'qwe',
      bookId: 'asd',
    };
    it('should call cancelSlot with post method', fakeAsync(() => {
      smevService.cancelSlot(cancelRequestBody).subscribe((response) => {
        expect(response).toBe(responseMock);
      });
      const req = http.expectOne('/agg/cancel');
      expect(req.request.method).toBe('POST');
      req.flush(responseMock);
    }));

    it('should call cancelSlot with body', fakeAsync(() => {
      smevService
        .cancelSlot(cancelRequestBody)
        .subscribe((response) => expect(response).toBe(responseMock));
      const req = http.expectOne('/agg/cancel');
      const { body } = req.request;
      expect(body).toEqual(cancelRequestBody);
      req.flush(responseMock);
    }));
  });
});
