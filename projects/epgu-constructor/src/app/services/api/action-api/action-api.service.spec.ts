import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ActionApiService } from './action-api.service';
import { ConfigService } from '../../../config/config.service';
import { ConfigServiceStub } from '../../../config/config.service.stub';

describe('ActionApiService', () => {
  let service: ActionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ConfigService, useClass: ConfigServiceStub }, ActionApiService],
    });
    service = TestBed.inject(ActionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
