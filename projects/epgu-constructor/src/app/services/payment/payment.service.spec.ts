import { TestBed } from '@angular/core/testing';
import { PaymentService } from './payment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../config/constructor-config.service.stub';
import { RestService } from '../rest/rest.service';
import { ScreenService } from '../../screen/screen.service';
import { ComponentStateService } from '../component-state/component-state.service';
import { FormPlayerService } from '../form-player/form-player.service';
import { UserSessionService } from '../user-session/user-session.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let restService: RestService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestService,
        PaymentService,
        UserSessionService,
        ScreenService,
        ConstructorConfigService,
        ComponentStateService,
        FormPlayerService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    });
    service = TestBed.inject(PaymentService);
    restService = TestBed.inject(RestService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
