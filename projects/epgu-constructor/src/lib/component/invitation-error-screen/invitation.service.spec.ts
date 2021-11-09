import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { InvitationService, SUCCESS_MESSAGE, FAILURE_MESSAGE } from './invitation.service';
import {
  LoggerService,
  LoggerServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';

describe('InvitationService', () => {
  let service: InvitationService;
  let http: HttpClient;
  const snils = '000-000-000 01';
  const email = 'test@site.net';
  const orderId = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        InvitationService,
      ],
    });
    service = TestBed.inject(InvitationService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send post request with success', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModalSpy = jest.spyOn(InvitationService.prototype as any, 'openModal');
    const httpPostSpy = jest.spyOn(http, 'post').mockReturnValue(of({ errorCode: 0 }));
    service.post(
      `/orders/${orderId}/invitations/inviteToSign/send`,
      [{ email: email, id: snils, type: 'SNILS' }],
      { ref: 'testAnswerData', url: '' },
    );

    expect(httpPostSpy).toBeCalledWith(
      `/orders/${orderId}/invitations/inviteToSign/send`,
      [{ email: email, id: snils, type: 'SNILS' }],
      { withCredentials: true },
    );
    expect(openModalSpy).toBeCalledWith(SUCCESS_MESSAGE, []);
  });

  it('should send post request with error', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openModalSpy = jest.spyOn(InvitationService.prototype as any, 'openModal');
    const error = {
      status: 401,
      message: 'Вы не вошли в сиcтему',
    };
    const httpPostSpy = jest.spyOn(http, 'post').mockReturnValue(throwError(error));
    service.post(
      `/orders/${orderId}/invitations/inviteToSign/send`,
      [{ email: email, id: snils, type: 'SNILS' }],
      { ref: 'testAnswerData', url: '' },
    );

    expect(httpPostSpy).toBeCalledWith(
      `/orders/${orderId}/invitations/inviteToSign/send`,
      [{ email: email, id: snils, type: 'SNILS' }],
      { withCredentials: true },
    );
    expect(openModalSpy).toBeCalledWith(FAILURE_MESSAGE, []);
  });
});
