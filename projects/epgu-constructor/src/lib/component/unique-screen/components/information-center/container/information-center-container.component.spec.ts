import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { InformationCenterContainerComponent } from './information-center-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import {
  UnsubscribeService,
  ConstructorDropdownModule,
  ScreenPadModule,
  DatesToolsService,
  ConfigService,
  LoggerService,
} from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { InformationCenterSimpleComponent } from '../component/information-center-short/information-center-simple.component';
import { InformationCenterFullComponent } from '../component/information-center-full/information-center-full.component';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { InformationCenterPfr, PfrAreaType } from '../information-center.models';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { configureTestSuite } from 'ng-bullet';
import { DateRestrictionsService } from '../../../../../shared/services/date-restrictions/date-restrictions.service';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';

describe('InformationCenterContainerComponent', () => {
  let component: InformationCenterContainerComponent;
  let fixture: ComponentFixture<InformationCenterContainerComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;
  const mockData: InformationCenterPfr = {
    id: 'dict55',
    type: UniqueScreenComponentTypes.informationCenterPfr,
    label: 'ПФР',
    attrs: {
      dictionaryType: 'TO_PFR',
      simple: { items: [], label: 'LABEL', html: '<p>HTML</p>' },
      full: {
        region: {
          label: 'Регион',
          attributeName: 'parent_attr',
          condition: 'CONTAINS' as DictionaryConditions,
        },
        district: {
          label: 'Район (Административный центр)',
          attributeName: 'parent_attr',
          condition: 'EQUALS' as DictionaryConditions,
        },
        cityDistrict: {
          label: 'Городской район',
          attributeName: 'parent_attr',
          condition: 'EQUALS' as DictionaryConditions,
        },
        territory: {
          label: 'Территориальный орган',
          attributeName: 'parent_attr',
          condition: 'CONTAINS' as DictionaryConditions,
        },
      },
    },
    value: '',
  };
  const mockCachedValue = {
    region: {
      originalItem: {
        value: '032',
        parentValue: null,
        title: 'Алтайский край',
        isLeaf: true,
        children: [],
        attributes: [],
        source: null,
        attributeValues: {},
      },
      id: '032',
      text: 'Алтайский край',
    },
    district: {
      originalItem: {
        value: '032000690',
        parentValue: null,
        title: 'Алтайский район с. Алтайское',
        isLeaf: true,
        children: [],
        attributes: [],
        source: null,
        attributeValues: {},
      },
      id: '032016',
      text: 'Государственное учреждение ',
    },
    territory: {
      originalItem: {
        value: '032016',
        parentValue: null,
        title: 'Государственное учреждение',
        isLeaf: true,
        children: [],
        attributes: [],
        source: null,
        attributeValues: {},
      },
      id: '032016',
      text: 'Государственное учреждение',
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        InformationCenterContainerComponent,
        MockComponent(InformationCenterFullComponent),
        MockComponent(InformationCenterSimpleComponent),
      ],
      imports: [
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorDropdownModule),
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(ScreenPadModule),
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
        DateRestrictionsService,
        ConfigService,
        LoggerService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    screenService.component = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeForm', () => {
    it('should be change currentAnswersService', () => {
      const form = { isValid: true, value: {} as any };

      component.changeForm(form);
      expect(component.currentAnswersService.isValid).toBeTruthy();
      expect(component.currentAnswersService.state).toEqual(JSON.stringify(form.value));
    });

    it('should be call changeForm from epgu-constructor-information-center-full', () => {
      jest.spyOn(component, 'changeForm');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-full'),
      );
      debugEl.triggerEventHandler('formChangeEvent', {});

      expect(component.changeForm).toHaveBeenCalled();
    });

    it('should be call changeForm from epgu-constructor-information-center-simple', () => {
      const mockDataWithSimple: InformationCenterPfr = {
        id: 'dict55',
        type: UniqueScreenComponentTypes.informationCenterPfr,
        label: 'ПФР',
        attrs: {
          dictionaryType: 'TO_PFR',
          simple: { items: [{} as any], label: 'LABEL', html: '<p>HTML</p>' },
          full: {
            region: {
              label: 'Регион',
              attributeName: 'parent_attr',
              condition: 'CONTAINS' as DictionaryConditions,
            },
            district: {
              label: 'Район (Административный центр)',
              attributeName: 'parent_attr',
              condition: 'EQUALS' as DictionaryConditions,
            },
            cityDistrict: {
              label: 'Городской район',
              attributeName: 'parent_attr',
              condition: 'EQUALS' as DictionaryConditions,
            },
            territory: {
              label: 'Территориальный орган',
              attributeName: 'parent_attr',
              condition: 'CONTAINS' as DictionaryConditions,
            },
          },
        },
        value: '',
      };
      screenService.component = mockDataWithSimple;
      fixture.detectChanges();
      jest.spyOn(component, 'changeForm');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-simple'),
      );
      debugEl.triggerEventHandler('formChangeEvent', {});

      expect(component.changeForm).toHaveBeenCalled();
    });
  });

  describe('fetchDictionary', () => {
    it('should be call fetchDictionary', () => {
      jest.spyOn(component, 'fetchDictionary');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-full'),
      );
      debugEl.triggerEventHandler('selectEvent', {});

      expect(component.fetchDictionary).toHaveBeenCalled();
    });

    it('should be update dictionary with []', () => {
      const params = { value: null, type: PfrAreaType.territory } as any;
      component.fetchDictionary(params);

      expect(component.territoryDictionary$.getValue()).toEqual([]);
    });
  });

  describe('setCashedValue', () => {
    it('should be set CashedValue', () => {
      jest.spyOn(component, 'fetchDictionary');
      mockData.value = JSON.stringify(mockCachedValue);
      screenService.component = mockData;

      expect(component.fetchDictionary).toBeCalledTimes(0);
    });

    it('should be not set CashedValue', () => {
      jest.spyOn(component, 'fetchDictionary');
      mockData.value = JSON.stringify({});
      screenService.component = mockData;

      expect(component.fetchDictionary).toBeCalledTimes(0);
    });
  });
});
