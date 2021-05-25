import { TestBed } from '@angular/core/testing';
import { CfSpaService } from './cf-spa.service';
import { configureTestSuite } from 'ng-bullet';

describe('CfSpaService', () => {
  let service: CfSpaService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [CfSpaService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CfSpaService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
