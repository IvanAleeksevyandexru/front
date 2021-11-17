import { HttpClient, HttpHandler } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';
import { LocalStorageService, WINDOW } from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { ScreenService } from '../../../screen/screen.service';
import { CachedAnswersService } from '../cached-answers/cached-answers.service';
import { PrepareComponentsService } from '../prepare-components/prepare-components.service';
import { UniquenessErrorsService } from './uniqueness-errors.service';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { CachedAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';

describe('UniquenessErrorsService', () => {
  let service: UniquenessErrorsService;
  let screenService: ScreenService;

  const cachedAnswersMock: CachedAnswersDto = {
    id1: {
      value: '{"control1":"value"}',
      visited: true,
    },
  };
  const componentMock: ComponentDto = {
    id: 'id1',
    attrs: {},
    value: '',
    type: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniquenessErrorsService,
        ScreenService,
        UnsubscribeService,
        CurrentAnswersService,
        DeviceDetectorService,
        HttpClient,
        HttpHandler,
        ConfigService,
        LoggerService,
        MockProvider(PrepareComponentsService),
        CachedAnswersService,
        LocalStorageService,
        JsonHelperService,
        { provide: WINDOW, useValue: { navigator: {}}},
      ],
    });
    service = TestBed.inject(UniquenessErrorsService);
    screenService = TestBed.inject(ScreenService);
    screenService.component = componentMock;
    screenService.cachedAnswers = cachedAnswersMock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shoult set values on init', () => {
    jest
      .spyOn(screenService, 'uniquenessErrors$', 'get')
      .mockReturnValueOnce(
        of([
          [{ 1: 'error', 2: 'error2' }],
          [{ 3: 'error3', 4: 'error4' }],
          [{ 1: 'error', 5: 'error5' }],
        ]),
      );
    service.init();

    expect(service['_initErrors'].length).toBeGreaterThan(0);
    expect(Object.keys(service['_initValues']).length).toBeGreaterThan(0);
    expect(Object.keys(service['_componendIdErrorsMap']).length).toBeGreaterThan(0);
    expect(service.preparedUniquenessErrors).toBeTruthy();
  });

  it('should calculate prepared uniqueness errors', fakeAsync(() => {
    service['_initErrors'] = [[{ 1: 'error', 2: 'error2' }]];
    service['_initValues'] = [{ 1: 'value' }];
    service['_componendIdErrorsMap'] = { 1.2: [[0, 0]] };
    const spy = jest.spyOn<any, string>(service, 'triggerComponentErrorsUpdate');

    service.calculatePreparedUniqErrors([{ 1: 'error' }], 0);
    tick();

    expect(screenService.componentErrors).toBeTruthy();
    expect(spy).toBeCalled();
  }));

  it('should set _componendIdErrorsMap', () => {
    service['_initErrors'] = [[{ 1: 'error', 2: 'error2' }], [{ 3: 'error3', 4: 'error4' }]];

    expect(service['getComponentIdErrorsMap']()).toEqual({ 1.2: [[0, 0]], 3.4: [[1, 0]] });
  });

  it('should get state', () => {
    expect(service['getState']()).toEqual({ control1: 'value' });
  });

  it('should prepare uniquenessErrors', () => {
    service['_initErrors'] = [[{ 1: 'error', 2: 'error2' }], [{ 3: 'error3', 4: 'error4' }]];

    expect(service['prepareUniquenessErrors'](service['_initErrors'])).toEqual([
      { 1: 'error', 2: 'error2' },
      { 3: 'error3', 4: 'error4' },
    ]);
  });

  it('should update screenService.componentErrors on triggerComponentErrorsUpdate', () => {
    expect(screenService.componentErrors).toBeFalsy();
    service['triggerComponentErrorsUpdate']();

    expect(screenService.componentErrors).toBeTruthy();
  });

  it('should remove last duplicated error', () => {
    service['_initErrors'] = [[{ 1: 'error', 2: 'error2' }], [{ 3: 'error3', 4: 'error4' }]];
    service['_componendIdErrorsMap'] = { 1.2: [[0, 0]], 3.4: [[1, 0]] };

    service['removeLastDuplicateError']('1.2');

    expect(service['_initErrors']).toEqual([[null], [{ 3: 'error3', 4: 'error4' }]]);
  });
});
