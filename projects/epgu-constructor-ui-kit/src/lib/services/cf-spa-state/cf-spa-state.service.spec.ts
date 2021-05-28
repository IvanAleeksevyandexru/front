import { TestBed } from '@angular/core/testing';
import { CfSpaStateService } from './cf-spa-state.service';
import { configureTestSuite } from 'ng-bullet';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../local-storage/local-storage.service.stub';

describe('CfSpaService', () => {
  let service: CfSpaStateService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        CfSpaStateService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub }
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CfSpaStateService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
