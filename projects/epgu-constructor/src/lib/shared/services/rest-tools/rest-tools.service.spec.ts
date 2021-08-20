import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { RestToolsService } from './rest-tools.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { RestService } from '../rest/rest.service';
import { MockProvider } from 'ng-mocks';
import {
  ComponentsListRelationsService
} from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { InterpolationService } from '../interpolation/interpolation.service';

describe('RestToolsService', () => {
  let service: RestToolsService;
  let httpTestingController: HttpTestingController;
  let localStorage: LocalStorageService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestToolsService,
        MockProvider(RestService),
        MockProvider(ComponentsListRelationsService),
        MockProvider(InterpolationService),
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(RestToolsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('fetch', () => {
    it('should be return request with body', () => {
      expect(service).toBeTruthy();
    });
  });
});
