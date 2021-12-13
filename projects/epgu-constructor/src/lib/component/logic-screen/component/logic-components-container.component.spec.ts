import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectionStrategy, QueryList } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MockComponent } from 'ng-mocks';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import {
  AttributeTypes,
  DictionaryConditions,
  LogicComponentEventTypes,
  LogicComponentMethods,
  LogicComponents,
} from '@epgu/epgu-constructor-types';
import { LogicComponentsContainerComponent } from './logic-components-container.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { BaseModule } from '../../../shared/base.module';
import { HookService } from '../../../core/services/hook/hook.service';
import { HookServiceStub } from '../../../core/services/hook/hook.service.stub';
import { LogicComponentResolverComponent } from '../component-list-resolver/logic-component-resolver.component';

const componentsMock: LogicComponents[] = [
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
  {
    id: 's8restcall',
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
      events: [LogicComponentEventTypes.ON_INIT],
    },
    value: '{}',
  },
];

describe('LogicComponentsContainerComponent', () => {
  let component: LogicComponentsContainerComponent;
  let fixture: ComponentFixture<LogicComponentsContainerComponent>;
  let screenService: ScreenService;
  let hookService: HookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogicComponentsContainerComponent,
        MockComponent(LogicComponentResolverComponent),
      ],
      imports: [BaseModule, HttpClientModule],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: HookService, useClass: HookServiceStub },
        UnsubscribeService,
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
    fixture = TestBed.createComponent(LogicComponentsContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    hookService = TestBed.inject(HookService);
  });

  it('should clear hooks if no before submit components are present', () => {
    const clearSpy = jest.spyOn(hookService, 'clearHook');
    screenService.logicComponents = [componentsMock[0]];

    component.ngOnInit();

    expect(clearSpy).toHaveBeenCalled();
  });

  it('should not clear hooks if reject & submit components are present', () => {
    const clearSpy = jest.spyOn(hookService, 'clearHook');
    screenService.logicComponents = componentsMock;

    component.ngOnInit();

    expect(clearSpy).not.toHaveBeenCalled();
  });

  it('should set loading to true if init component is present', () => {
    screenService.logicComponents = componentsMock;

    component.ngOnInit();

    expect(screenService.isLogicComponentLoading).toBeTruthy();
  });

  it('should subscribe to init hooks if viewComponents has been set', () => {
    const spy = jest.spyOn<any, string>(component, 'resetInitSubscribe');
    component.viewComponents = {} as QueryList<LogicComponentResolverComponent>;
    screenService.logicComponents = [componentsMock[3]];
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set loading to false if all initial observables have resolved', () => {
    const mockViewComponents = [{} as any];
    mockViewComponents[0].componentDto = componentsMock[0];
    mockViewComponents[0].componentRef = {};
    mockViewComponents[0].componentRef.instance = {};
    const testSubject = (mockViewComponents[0].componentRef.instance.hasLoaded = new BehaviorSubject(
      false,
    ));
    component.viewComponents = mockViewComponents as any;
    screenService.isLogicComponentLoading = true;

    component.subscribeToInitHooks();

    expect(screenService.isLogicComponentLoading).toBeTruthy();
    testSubject.next(true);
    expect(screenService.isLogicComponentLoading).toBeFalsy();
  });
});
