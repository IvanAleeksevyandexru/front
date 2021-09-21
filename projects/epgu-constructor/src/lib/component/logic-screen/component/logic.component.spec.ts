import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservableInput, of } from 'rxjs';

import { LogicComponent } from './logic.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { LogicService } from '../service/logic.service';
import {
  DatesToolsService,
  ObjectHelperService,
  UnsubscribeService,
  DownloadService,
} from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../shared/base.module';
import { LocalStorageService, LocalStorageServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { ApplicantAnswersDto } from '@epgu/epgu-constructor-types';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookServiceStub } from '../../../core/services/hook/hook.service.stub';
import { DictionaryToolsService } from '../../../shared/services/dictionary/dictionary-tools.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { DictionaryApiService } from '../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListFormService } from '../../custom-screen/services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../custom-screen/services/components-list-form/components-list-form.service.stub';
import { MockProvider, MockProviders } from 'ng-mocks';
import { ComponentsListRelationsService } from '../../custom-screen/services/components-list-relations/components-list-relations.service';
import { SuggestHandlerService } from '../../../shared/services/suggest-handler/suggest-handler.service';
import { HookTypes } from '../../../core/services/hook/hook.constants';
import { NavigationPayload } from '../../../form-player/form-player.types';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { RestToolsService } from '../../../shared/services/rest-tools/rest-tools.service';
import { RestService } from '../../../shared/services/rest/rest.service';
import { HttpClientModule } from '@angular/common/http';

describe('LogicComponent', () => {
  let component: LogicComponent;
  let fixture: ComponentFixture<LogicComponent>;
  let screenService: ScreenService;
  let logicService: LogicService;
  let hookService: HookService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LogicComponent],
      imports: [BaseModule, HttpClientModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: HookService, useClass: HookServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        MockProviders(DatesToolsService, ComponentsListRelationsService, SuggestHandlerService),
        MockProvider(RestToolsService),
        MockProvider(RestService),
        LogicService,
        UnsubscribeService,
        DictionaryToolsService,
        CurrentAnswersService,
        DownloadService,
        ObjectHelperService,
        JsonHelperService,
      ],
    })
      .overrideComponent(LogicComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicComponent);
    component = fixture.componentInstance;
    logicService = TestBed.inject(LogicService);
    screenService = TestBed.inject(ScreenService);
    hookService = TestBed.inject(HookService);
    screenService.logicComponents = [
      {
        id: 'rest1',
        type: 'RestCall',
        attrs: {},
        value: JSON.stringify({
          url: 'url',
          headers: { headers: 'headers' },
          method: 'POST',
          body: 'body',
          path: 'path',
        }),
      },
      {
        id: 's6restcall',
        type: 'RestCall',
        attrs: {
          url: 'https://pgu-uat-fed.test.gosuslugi.ru',
          method: 'POST',
          path: '/api/nsi/v1/dictionary/CONC_COMPETENT_ORG',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: '',
          events: ['ON_BEFORE_SUBMIT'],
          dictionaryType: 'CONC_COMPETENT_ORG',
          dictionaryFilter: [
            {
              attributeName: 'LIC_TYPE',
              attributeType: 'asDecimal',
              condition: 'EQUALS',
              value: 's6lookup.value.originalItem.attributeValues.CODE',
              valueType: 'ref',
            },
          ],
        },
        value: '{}',
      },
    ];
    fixture.detectChanges();
  });

  const prepareDataAfterFetch = (logicComponent) => ({
    id: logicComponent.id,
    attrs: logicComponent.attrs,
    value: JSON.parse(logicComponent.value as string),
  });

  it('should be set logicAnswers', () => {
    const applicantAnswersDto: ApplicantAnswersDto = {
      rest: {
        visited: true,
        value: 'value',
      },
    };
    const expectedValue = screenService.logicComponents
      .filter(
        (logicComponent) =>
          !Array.isArray(logicComponent.attrs.events) ||
          logicComponent.attrs.events.indexOf('INIT') !== -1,
      )
      .map(prepareDataAfterFetch);

    const fetchSpy = jest.spyOn(logicService, 'fetch').mockReturnValue([of(applicantAnswersDto)]);

    component.ngOnInit();

    expect(fetchSpy).toHaveBeenCalledWith(expectedValue);
    expect(screenService.logicAnswers).toEqual(applicantAnswersDto);
  });

  it('should add hook for non init events', () => {
    jest.spyOn(logicService, 'fetch').mockReturnValue([of({})]);
    const addHookSpy = jest.spyOn(hookService, 'addHook');

    component.ngOnInit();

    expect(addHookSpy).toHaveBeenCalledTimes(1);
  });

  it('should run hooks for non init events', () => {
    const applicantAnswersDto: ApplicantAnswersDto = {
      rest: {
        visited: true,
        value: 'value',
      },
    };
    const hooks = {};
    const fetchSpy = jest.spyOn(logicService, 'fetch').mockReturnValue([of(applicantAnswersDto)]);
    jest
      .spyOn(hookService, 'addHook')
      .mockImplementation((type: HookTypes, observable: ObservableInput<NavigationPayload>) => {
        if (!Array.isArray(hooks[type])) {
          hooks[type] = [observable];
        } else {
          hooks[type].push(observable);
        }
      });

    const expectedValue1 = screenService.logicComponents
      .filter(
        (logicComponent) =>
          !Array.isArray(logicComponent.attrs.events) ||
          logicComponent.attrs.events.indexOf('INIT') !== -1,
      )
      .map(prepareDataAfterFetch);
    const expectedValue2 = screenService.logicComponents
      .filter(
        (logicComponent) =>
          Array.isArray(logicComponent.attrs.events) &&
          logicComponent.attrs.events.indexOf('ON_BEFORE_SUBMIT') !== -1,
      )
      .map(prepareDataAfterFetch);

    component.ngOnInit();
    hooks['ON_BEFORE_SUBMIT'][0].subscribe();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, expectedValue1);
    expect(fetchSpy).toHaveBeenNthCalledWith(2, expectedValue2);
  });
});
