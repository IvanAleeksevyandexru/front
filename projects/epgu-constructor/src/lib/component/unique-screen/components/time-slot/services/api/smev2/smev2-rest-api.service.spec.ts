import { TestBed } from '@angular/core/testing';
import { Smev2RestApiService } from './smev2-rest-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../screen/screen.service.stub';
import { TimeSlotRequestType } from '../../../typings';

describe('Smev2RestApiService', () => {
  let service: Smev2RestApiService;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        Smev2RestApiService,
      ],
    });

    configService = TestBed.inject(ConfigService);
    service = TestBed.inject(Smev2RestApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('base', () => {
    it('should be getType', () => {
      expect(service.getType()).toBe(TimeSlotRequestType.list);
    });
    it('should be hasError', () => {
      expect(service.hasError({ errorMessage: '1' })).toBe(true);
      const detail = { errorMessage: '1', errorCode: 1 };
      expect(service.hasError({ errorDetail: detail })).toBe(true);
    });
    it('should be getList', () => {
      service.getList({}).subscribe((v) => {
        expect(v).toEqual([]);
      });
      httpTestingController.expectOne(service.path).flush({ items: [] });
    });
  });
});
