import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { UnsubscribeService, UnsubscribeServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DTOActionAction } from '@epgu/epgu-constructor-types';
import { HttpClientModule } from '@angular/common/http';
import { InformationCenterMvdContainerComponent } from './information-center-mvd-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DictionaryApiServiceStub } from '../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { InformationCenterMvdI } from '../interface/information-center-mvd.interface';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { InformationCenterCardComponent } from '../components/information-center-card/information-center-card.component';
import { InformationCenterFormComponent } from '../components/information-center-form/information-center-form.component';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';

describe('InformationCenterMvdContainerComponent', () => {
  let component: InformationCenterMvdContainerComponent;
  let fixture: ComponentFixture<InformationCenterMvdContainerComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;
  const mockData: InformationCenterMvdI = {
    id: '1',
    type: UniqueScreenComponentTypes.cityDepartment,
    label: '',
    value: '',
    valueFromCache: false,
    required: false,
    attrs: {
      sourceDictionary: {
        type: '',
        label: '',
        text: '',
        hint: '',
      },
      dictionaryToRequest: {
        type: '',
        label: '',
        text: '',
        hint: '',
      },
      actions: [
        {
          label: '',
          value: '0',
          action: DTOActionAction.getPrevStep,
        },
      ],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InformationCenterMvdContainerComponent,
        MockComponent(InformationCenterCardComponent),
        MockComponent(InformationCenterFormComponent),
      ],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        HttpClientModule,
      ],
      providers: [
        MockProvider(DictionaryToolsService),
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
      ],
    })
      .overrideComponent(InformationCenterMvdContainerComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterMvdContainerComponent);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    const response = {
      error: { code: 0, message: 'operation completed' },
      fieldErrors: [],
      total: 1,
      items: [
        {
          value: '001',
          parentValue: null,
          title: '???????????????????? ????????????',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        },
      ],
    };
    jest.spyOn(dictionaryApiService, 'getMvdDictionary').mockReturnValue(of(response as any));
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockData;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should be update dictionaryToRequest', () => {
      component.data$.subscribe(() => {
        expect(component.dictionaryToRequest).toEqual(mockData.attrs.dictionaryToRequest);
      });
    });

    it('should be update sourceList', () => {
      const expectedValue = [
        {
          value: '001',
          parentValue: null,
          title: '???????????????????? ????????????',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        },
      ];
      component.data$.subscribe(() => {
        expect(component.sourceList).toEqual(expectedValue);
      });
    });
  });

  describe('handleSelect', () => {
    const selector = 'epgu-constructor-information-center-form';

    it('should be clear infoCenterList', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      debugEl.triggerEventHandler('handleSelectEvent', {});
      expect(component.infoCenterList).toEqual([]);
    });

    it('should be loadInfoCenterDictionary', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      const expectedValue = [
        {
          value: '001',
          parentValue: null,
          title: '???????????????????? ????????????',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        },
      ];
      debugEl.triggerEventHandler('handleSelectEvent', {
        originalItem: {
          value: '004',
          parentValue: null,
          title: '???????????????????? ??????????',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        },
        id: '004',
        text: '???????????????????? ??????????',
      });
      expect(component.infoCenterList).toEqual(expectedValue);
    });
  });
});
