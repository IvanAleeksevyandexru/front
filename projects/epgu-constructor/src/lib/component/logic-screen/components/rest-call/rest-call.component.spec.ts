import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservableInput, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MockProvider, MockProviders } from 'ng-mocks';

import {
  DatesToolsService,
  ObjectHelperService,
  UnsubscribeService,
  DownloadService,
  JsonHelperService,
  LocalStorageService,
  LocalStorageServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  ApplicantAnswersDto,
  NavigationPayload,
  LogicComponentEventTypes,
  LogicComponentMethods,
  AttributeTypes,
  DictionaryConditions,
} from '@epgu/epgu-constructor-types';
import RestCallComponent from './rest-call.component';
import { LogicComponentsContainerComponent } from '../../component/logic-components-container.component';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { HookServiceStub } from '../../../../core/services/hook/hook.service.stub';
import { ComponentsListFormServiceStub } from '../../../custom-screen/services/components-list-form/components-list-form.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { LogicService } from '../../service/logic.service';
import { HookService } from '../../../../core/services/hook/hook.service';
import { BaseModule } from '../../../../shared/base.module';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { ComponentsListFormService } from '../../../custom-screen/services/components-list-form/components-list-form.service';
import { ComponentsListRelationsService } from '../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import { RestService } from '../../../../shared/services/rest/rest.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { HookTypes } from '../../../../core/services/hook/hook.constants';
import { LogicComponentResolverComponent } from '../../component-list-resolver/logic-component-resolver.component';

describe('RestCallComponent', () => {
  let component: RestCallComponent;
  let fixture: ComponentFixture<RestCallComponent>;
  let screenService: ScreenService;
  let logicService: LogicService;
  let hookService: HookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogicComponentsContainerComponent,
        LogicComponentResolverComponent,
        RestCallComponent,
      ],
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
      .overrideComponent(LogicComponentsContainerComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestCallComponent);
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
          method: LogicComponentMethods.POST,
          path: '/api/nsi/v1/dictionary/CONC_COMPETENT_ORG',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: '',
          events: [LogicComponentEventTypes.ON_BEFORE_SUBMIT],
          dictionaryType: 'CONC_COMPETENT_ORG',
          dictionaryFilter: [
            {
              attributeName: 'LIC_TYPE',
              attributeType: AttributeTypes.asDecimal,
              condition: DictionaryConditions.EQUALS,
              value: 's6lookup.value.originalItem.attributeValues.CODE',
              valueType: 'ref',
            },
          ],
        },
        value: '{}',
      },
      {
        id: 's7restcall',
        type: 'RestCall',
        attrs: {
          url: 'https://pgu-uat-fed.test.gosuslugi.ru',
          method: LogicComponentMethods.POST,
          path: '/api/nsi/v1/dictionary/CONC_COMPETENT_ORG',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
          body: '',
          events: [LogicComponentEventTypes.ON_BEFORE_REJECT],
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
          logicComponent.attrs.events.indexOf(LogicComponentEventTypes.ON_INIT) !== -1,
      )
      .map(prepareDataAfterFetch);

    const fetchSpy = jest.spyOn(logicService, 'fetch').mockReturnValue([of(applicantAnswersDto)]);
    component.componentDto = screenService.logicComponents[0];
    component.ngOnInit();

    expect(fetchSpy).toHaveBeenCalledWith(expectedValue);
    expect(screenService.logicAnswers).toEqual(applicantAnswersDto);
  });

  it('should add hook for events', () => {
    component.componentDto = screenService.logicComponents[1];
    jest.spyOn(logicService, 'fetch').mockReturnValue([of({})]);
    const addHookSpy = jest.spyOn(hookService, 'addHook');

    component.ngOnInit();

    expect(addHookSpy).toHaveBeenCalledTimes(1);
  });

  it('should run hooks for BEFORE_SUBMIT', () => {
    component.componentDto = screenService.logicComponents[1];
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
    const expectedValue2 = screenService.logicComponents
      .filter(
        (logicComponent) =>
          Array.isArray(logicComponent.attrs.events) &&
          logicComponent.attrs.events.indexOf(LogicComponentEventTypes.ON_BEFORE_SUBMIT) !== -1,
      )
      .map(prepareDataAfterFetch);

    component.ngOnInit();
    hooks.ON_BEFORE_SUBMIT[0].subscribe();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, expectedValue2);
  });

  it('should run hooks for BEFORE_REJECT', () => {
    component.componentDto = screenService.logicComponents[2];
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
    const expectedValue2 = screenService.logicComponents
      .filter(
        (logicComponent) =>
          Array.isArray(logicComponent.attrs.events) &&
          logicComponent.attrs.events.indexOf(LogicComponentEventTypes.ON_BEFORE_REJECT) !== -1,
      )
      .map(prepareDataAfterFetch);

    component.ngOnInit();
    hooks.ON_BEFORE_REJECT[0].subscribe();

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(1, expectedValue2);
  });
});
