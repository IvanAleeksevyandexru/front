import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {
  LocalStorageService,
  LocalStorageServiceStub,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { MockProvider } from 'ng-mocks';
import { RestToolsService } from './rest-tools.service';
import { RestService } from '../rest/rest.service';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { InterpolationService } from '../interpolation/interpolation.service';
import { DateRangeService } from '../date-range/date-range.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';

describe('RestToolsService', () => {
  let service: RestToolsService;
  let httpTestingController: HttpTestingController;
  let localStorage: LocalStorageService;
  let componentsListRelationsService: ComponentsListRelationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestToolsService,
        MockProvider(ComponentsListRelationsService),
        MockProvider(RestService),
        MockProvider(InterpolationService),
        MockProvider(DateRangeService),
        MockProvider(DateRefService),
        MockProvider(DateRestrictionsService),
        MockProvider(JsonHelperService),
        MockProvider(RefRelationService),
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(RestToolsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    localStorage = TestBed.inject(LocalStorageService);
    componentsListRelationsService = TestBed.inject(ComponentsListRelationsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('RestToolsService', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });
});
