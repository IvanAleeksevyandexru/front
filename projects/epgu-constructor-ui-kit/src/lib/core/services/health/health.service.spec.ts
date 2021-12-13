import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HealthService } from './health.service';
import { ActivatedRouteStub } from './activated-route.stub';

describe('HealthService', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }],
    });
  });

  it('should be created', () => {
    const service: HealthService = TestBed.inject(HealthService);
    expect(service).toBeTruthy();
  });
});
