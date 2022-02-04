import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService, ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';

describe('InviteService', () => {
  let service: InviteService;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InviteService, { provide: ConfigService, useClass: ConfigServiceStub }],
    });

    configService = TestBed.inject(ConfigService);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(InviteService);
  });

  describe('base', () => {
    it('should be getInvite', () => {
      service.getInvite('1', '2').subscribe((v) => {
        expect(v).toEqual({});
      });
      const request = httpTestingController.expectOne(`${service.path}?parentOrderId=1&bookId=2`);

      request.flush({});
    });
  });
});
