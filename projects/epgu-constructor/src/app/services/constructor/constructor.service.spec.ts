import { TestBed } from '@angular/core/testing';

import { ConstructorService } from './constructor.service';
import { RestService } from '../rest/rest.service';
import { RestServiceStub } from '../rest/rest.service.stub';

describe('ConstructorService', () => {
  let service: ConstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConstructorService,
        { provide: RestService, useClass: RestServiceStub },
      ]
    });
    service = TestBed.inject(ConstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
