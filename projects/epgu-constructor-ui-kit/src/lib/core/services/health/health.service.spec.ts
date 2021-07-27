import { TestBed } from '@angular/core/testing';
import { HealthService } from './health.service';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from './activated-route.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HealthService', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ],
    });
  });

  it('should be created', () => {
    const service: HealthService = TestBed.inject(HealthService);
    expect(service).toBeTruthy();
  });
});
