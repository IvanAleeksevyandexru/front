import { TestBed } from '@angular/core/testing';
import { LoggerService } from '../logger/logger.service';
import { LoggerServiceStub } from '../logger/logger.service.stub';
import { InitDataService } from './init-data.service';


describe('InitDataService', () => {
  let service: InitDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InitDataService,
        { provide: LoggerService, useClass: LoggerServiceStub },
      ]
    });
    service = TestBed.inject(InitDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
