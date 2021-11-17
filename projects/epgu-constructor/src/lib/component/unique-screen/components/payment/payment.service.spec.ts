import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { PaymentService } from './payment.service';
import { LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { PaymentsAttrs } from './payment.types';

describe('PaymentService', () => {
  let service: PaymentService;
  let http: HttpTestingController;
  let locationService: LocationService;
  let configService: ConfigService;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;

  const attrsMock: PaymentsAttrs = {
    dictItemCode: '100',
    nsi: '100',
    ref: { fiasCode: 'ms1.value' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(PaymentService);
    http = TestBed.inject(HttpTestingController);
    locationService = TestBed.inject(LocationService);
    configService = TestBed.inject(ConfigService);
    screenService = TestBed.inject(ScreenService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue({
      ms1: {
        visited: true,
        value: JSON.stringify({ value: 'R7700015' }),
      },
    });
  });

  it('should be transform sum for penny', () => {
    const sum = PaymentService.transformSumForPenny('70045');
    expect(sum).toBe('700,45');
  });

  it('should be call loadPaymentInfo with attrs', () => {
    const spy = jest.spyOn(service, 'getDictionaryInfo');
    service.loadPaymentInfo(attrsMock);
    expect(spy).toHaveBeenCalledWith(attrsMock);
  });

  describe('getReturnUrl', () => {
    it('should be return url', () => {
      jest
        .spyOn(locationService, 'getHref')
        .mockReturnValue('http://local.test.gosuslugi.ru:4200/');
      const url = service.getReturnUrl();
      expect(url).toBe('http%3A%2F%2Flocal.test.gosuslugi.ru%3A4200%3FgetLastScreen%3D1');
    });

    it('should be return encode url', () => {
      jest
        .spyOn(locationService, 'getHref')
        .mockReturnValue('http://local.test.gosuslugi.ru:4200/&getLastScreen=1');
      const url = service.getReturnUrl();
      expect(url).toBe('http://local.test.gosuslugi.ru:4200/&getLastScreen=1');
    });
  });

  describe('getDictionaryInfo', () => {
    it('should be return dictionary attributeValues', () => {
      const responseMock: any = {
        error: { code: 0, message: 'operation completed' },
        fieldErrors: [],
        total: 1,
        items: [
          {
            value: '153',
            parentValue: null,
            title: 'УФК по г. Москве (Главное управление Минюста России по Москве)',
            isLeaf: true,
            children: [],
            attributes: [],
            source: null,
            attributeValues: {
              DATAK: '',
            },
          },
        ],
      };

      jest.spyOn(dictionaryApiService, 'getDictionary').mockReturnValue(of(responseMock));
      service.getDictionaryInfo(attrsMock).subscribe((response) => {
        expect(response).toEqual({ DATAK: '' });
      });
    });

    it('should be return error', () => {
      const responseMock: any = {
        error: { code: 0, message: 'operation completed' },
        fieldErrors: [],
        total: 1,
        items: [
          {
            value: '153',
            parentValue: null,
            title: 'УФК по г. Москве (Главное управление Минюста России по Москве)',
            isLeaf: true,
            children: [],
            attributes: [],
            source: null,
            attributeValues: {
              DATAK: 'test',
            },
          },
        ],
      };

      jest.spyOn(dictionaryApiService, 'getDictionary').mockReturnValue(of(responseMock));
      service
        .getDictionaryInfo(attrsMock)
        .pipe(catchError((error: any) => of(error)))
        .subscribe((response) => {
          expect(response).toBeNull();
        });
    });
  });

  it('should be return payment link', () => {
    jest
      .spyOn(locationService, 'getHref')
      .mockReturnValue('http://local.test.gosuslugi.ru:4200/&getLastScreen=1');
    const link = service.getPaymentLink(100);
    expect(link).toBe(
      'https://oplata.gosuslugi.ru/?billIds=100&returnUrl=http://local.test.gosuslugi.ru:4200/&getLastScreen=1&subscribe=true',
    );
  });

  it('should be created payment request options', () => {
    const expectedOptions = {
      filter: {
        union: {
          subs: [
            {
              simple: {
                attributeName: 'FiasCode',
                condition: 'EQUALS',
                value: {
                  asString: 'R77',
                },
              },
            },
            {
              simple: {
                attributeName: 'filter_reg',
                condition: 'EQUALS',
                value: {
                  asString: 'R7700015',
                },
              },
            },
            {
              simple: {
                attributeName: 'dictem_code',
                condition: 'EQUALS',
                value: {
                  asString: '100',
                },
              },
            },
          ],
          unionKind: 'AND',
        },
      },
      pageSize: 258,
      tx: '41588125-d55f-11ea-8b86-fa163ee4b849',
    };

    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue({
      ms1: {
        visited: true,
        value: JSON.stringify({ value: 'R7700015' }),
      },
    });
    const options = service.createPaymentRequestOptions(attrsMock);
    expect(options).toEqual(expectedOptions);
  });
});
