import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConstructorConfigService } from '../config/constructor-config.service';
import { ConstructorConfigServiceStub } from '../config/constructor-config.service.stub';
import { RestService } from '../rest/rest.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestService,
        PaymentService,
        { provide: ConstructorConfigService, useClass: ConstructorConfigServiceStub }
      ]
    });
    service = TestBed.inject(PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
