import { TestBed } from '@angular/core/testing';
import { CfSpaStateService } from './cf-spa-state.service';
import { configureTestSuite } from 'ng-bullet';

describe('CfSpaService', () => {
  let service: CfSpaStateService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [CfSpaStateService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CfSpaStateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
