import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  EventBusService,
  LoggerService,
  UnsubscribeService,
  ActivatedRouteStub,
  BaseUiModule,
  DatesToolsServiceStub,
  UnsubscribeServiceStub,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictionaryComponent } from '../dictionary/dictionary.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { LookupInputComponent } from './lookup-input.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import LookupInputModelAttrs from './LookupInputModelAttrs';
import LookupInputModel from './LookupInputModel';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';
import { InviteService } from '../../../../core/services/invite/invite.service';
import { InviteServiceStub } from '../../../../core/services/invite/invite.service.stub';

const mockComponent = {
  id: 'mockComponentID',
  attrs: new LookupInputModelAttrs({
    dictionaryType: 'lookUpInputType',
    searchProvider: {
      dictionaryOptions: { additionalParams: [] },
      dictionaryFilter: [
        {
          attributeName: 'Session_Id',
          condition: 'EQUALS' as any,
          value: 'value',
          valueType: 'rawFilter',
        },
      ],
    },
  }),
  value: 'lookUpInput',
  required: false,
};

describe('LookupInputComponent', () => {
  let component: LookupInputComponent;
  let fixture: ComponentFixture<LookupInputComponent>;
  let formService: ComponentsListFormServiceStub;
  let providerSearchSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookupInputComponent, MockComponent(ComponentItemComponent)],
      imports: [
        MockModule(ValidationTypeModule),
        MockModule(BaseUiModule),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: InviteService, useClass: InviteServiceStub },
        MockProvider(JsonHelperService),
        MockProvider(ComponentsListToolsService),
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        MockProvider(SuggestHandlerService),
        MockProvider(EventBusService),
        MockProvider(SuggestMonitorService),
        CurrentAnswersService,
        LoggerService,
      ],
    })
      .overrideComponent(DictionaryComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  let valueControl: FormControl;
  let control: FormGroup;

  beforeEach(() => {
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
      model: new FormControl(new LookupInputModel({ attrs: mockComponent.attrs } as any)),
    });
    formService.form = new FormArray([control]);
    fixture = TestBed.createComponent(LookupInputComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    providerSearchSpy = jest.spyOn<any, string>(component, 'providerSearch');
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should be', function () {
    expect(component).toBeInstanceOf(LookupInputComponent);
  });

  it('epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.control).toBe(valueControl);
    expect(debugEl.componentInstance.component.id).toEqual(mockComponent.id);
    expect(debugEl.componentInstance.invalid).toBeFalsy();
    component.control.setErrors({
      someErrorKey: true,
    });
    fixture.detectChanges();
    expect(debugEl.componentInstance.invalid).toBeTruthy();
  });

  it('Expect searchProvider to be called once', () => {
    component.provider.search('test').subscribe();
    expect(providerSearchSpy).toBeCalled();
  });

  it('Should call re-render on dictionary update', () => {
    const reRenderSpy = jest.spyOn<any, string>(component, 'reRenderChildLookup');
    component.ngOnInit();

    component.model._dictionary$.next({ list: [{ id: 1, text: 'text' }] } as any);

    expect(reRenderSpy).toHaveBeenCalled();
  });

  it('Should call setFocus after re-render if focusOnInitAndStartSearch is true', () => {
    const setFocusSpy = jest.spyOn<any, string>(component, 'setFocusIfNeeded');

    jest.useFakeTimers();
    component.reRenderChildLookup();
    jest.runAllTimers();
    jest.useRealTimers();

    expect(setFocusSpy).toHaveBeenCalledTimes(1);
  });
});
