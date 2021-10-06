import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { RestToolsService } from './rest-tools.service';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { RestService } from '../rest/rest.service';
import { MockProvider } from 'ng-mocks';
import { ComponentsListRelationsService } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.service';
import { InterpolationService } from '../interpolation/interpolation.service';
import { mockComponent } from '../../directives/action/action.mock';
import { CustomComponent } from '../../../component/custom-screen/components-list.types';
import { DateRangeService } from '../date-range/date-range.service';
import { RefRelationService } from '../ref-relation/ref-relation.service';
import { DateRestrictionsService } from '../date-restrictions/date-restrictions.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { DateRefService } from '../../../core/services/date-ref/date-ref.service';

describe('RestToolsService', () => {
  let service: RestToolsService;
  let httpTestingController: HttpTestingController;
  let localStorage: LocalStorageService;
  let componentsListRelationsService: ComponentsListRelationsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestToolsService,
        ComponentsListRelationsService,
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

  describe('watchForUpdates', () => {
    it('should call loadReferenceData$()', () => {
      const _mockComponent = mockComponent as CustomComponent;
      const spy = jest.spyOn(service, 'loadReferenceData$');
      service.watchForUpdates([_mockComponent]).subscribe();
      expect(spy).toBeCalledWith([]);
    });
  });
});
