import { TestBed } from '@angular/core/testing';

import { InvitationErrorService } from './invitation-error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService, LoggerServiceStub, ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';

describe('InvationErrorService', () => {
  let service: InvitationErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        InvitationErrorService
      ]
    });
    service = TestBed.inject(InvitationErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
