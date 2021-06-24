import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ConfigService, DatesToolsService, DatesToolsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ReferralNumberService } from './referral-number.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { configureTestSuite } from 'ng-bullet';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { HttpRequest } from '@angular/common/http';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { expand } from 'rxjs/operators';

describe('ReferralNumberService', () => {
  let service: ReferralNumberService;
  let http: HttpTestingController;
  let configService: ConfigService;
  let screenService: ScreenService;
  let dictionaryToolsService: DictionaryToolsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ReferralNumberService,
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        RefRelationService,
        DateRestrictionsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ReferralNumberService);
    http = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(ConfigService);
    screenService = TestBed.inject(ScreenService);
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
    jest.spyOn(screenService, 'getStore').mockReturnValue({});
  });

  it('should be transform sum for penny', () => {
    const result = {
      totalItems: null,
      items: [],
      version: null,
      error: {}
    };
    service
      .getReferralSearch('123', 'sessionId', 'serviceId')
      .subscribe(data => {
        expect(data).toEqual(result);
      });

    const request = http.expectOne((req: HttpRequest<any>) => req.url.includes('v1/equeue/agg/ref/items'));

    expect(request.request.body).toEqual({
      eserviceId: 'serviceId',
      parentRefItemValue: null,
      treeFiltering: 'ONELEVEL',
      refName: 'Referral',
      filter: {
        union: {
          unionKind: 'AND',
          subs: [
            {
              simple: {
                attributeName: 'Referral_Number',
                condition: 'EQUALS' as DictionaryConditions,
                value: '123',
                checkAllValues: true,
              }
            },
            {
              simple: {
                attributeName: 'Session_Id',
                condition: 'EQUALS' as DictionaryConditions,
                value: 'sessionId',
                checkAllValues: true,
              }
            },
          ]
        }
      },
    });

    request.flush(result);
    http.verify();
  });
});
