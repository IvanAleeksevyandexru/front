import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  ActivatedRouteStub,
  ConfigService,
  ConfigServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ActivatedRoute } from '@angular/router';
import { ComponentDto } from '@epgu/epgu-constructor-types';

describe('InviteService', () => {
  let service: InviteService;
  let httpTestingController: HttpTestingController;
  let configService: ConfigService;
  let screenService: ScreenService;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InviteService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    });

    configService = TestBed.inject(ConfigService);
    screenService = TestBed.inject(ScreenService);
    route = TestBed.inject(ActivatedRoute);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(InviteService);
  });

  describe('base', () => {
    it('should be getFilter', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ attrs: { isInvite: true } } as ComponentDto);
      service.getFilter('1', '2').subscribe((v) => {
        expect(v).toEqual({});
      });
      const request = httpTestingController.expectOne(`${service.path}?parentOrderId=1&bookId=2`);

      request.flush({});
    });

    it('should be getFilter for isInvite = false', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ attrs: { isInvite: false } } as ComponentDto);
      service.getFilter('1', '2').subscribe((v) => {
        expect(v).toEqual({});
      });
      httpTestingController.expectNone(`${service.path}?parentOrderId=1&bookId=2`);
    });

    it('should be getInvite', () => {
      service.getInvite('1', '2').subscribe((v) => {
        expect(v).toEqual({});
      });
      const request = httpTestingController.expectOne(`${service.path}?parentOrderId=1&bookId=2`);

      request.flush({});
    });
  });
});
