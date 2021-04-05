import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';

import { InformationCenterPfrContainerComponent } from './information-center-pfr-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { InformationCenterPfrSimpleComponent } from '../component/information-center-pfr-short/information-center-pfr-simple.component';
import { InformationCenterPfrFullComponent } from '../component/information-center-pfr-full/information-center-pfr-full.component';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { ConstructorDropdownModule } from '../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenPadModule } from '../../../../../shared/components/screen-pad/screen-pad.module';
import { InformationCenterPfr, PfrAreaType } from '../information-center-pfr.models';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from '../../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { DatesToolsService } from '../../../../../core/services/dates-tools/dates-tools.service';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { SopService } from '../../../../../shared/services/sop/sop.service';
import { SopServiceStub } from '../../../../../shared/services/sop/sop.service.stub';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';

const getComponentJson = (
  componentJson: Partial<InformationCenterPfr> = {},
): InformationCenterPfr => {
  return {
    id: 'pd18',
    type: 'InformationCenterPfr',
    label: '',
    attrs: {
      label: 'Территориальный орган',
      ref: [],
      serviceCode: {
        type: 'service_4',
        value: '10002574289',
      },
      simple: {
        items: componentJson?.attrs?.simple?.items || [],
        label: 'Куда уйдёт заявление',
        html: '<p>Определён автоматически</p>',
      },
      full: {
        region: {
          label: 'Регион',
          sourceUid: '42fd59f8-cea9-41f8-9fad-f53c74aec567',
          columnUids: ['1a4fc9f7-1014-4376-a3ec-b96056bdcf3d'],
          dictionarySopTest: true,
          key: 'divisionCode',
          value: 'toPfrCode',
        },
        district: {
          label: 'Район (Административный центр)',
          sourceUid: '42fd59f8-cea9-41f8-9fad-f53c74aec567',
          columnUids: ['8caf6cb5-43a0-46b1-bf57-2bb1462a10c0'],
          dictionarySopTest: true,
          key: 'divisionCode',
          value: 'toPfrCode',
        },
        cityDistrict: {
          label: 'Городской район',
          sourceUid: '42fd59f8-cea9-41f8-9fad-f53c74aec567',
          columnUids: [
            'c31f0a0e-79b4-4af3-9c66-9fc7bd830b00',
            'a1b4db31-10ae-4864-8301-f7a66bca102f',
          ],
          dictionarySopTest: true,
          key: 'OKATO',
          value: 'name',
        },
        territory: {
          label: 'Территориальный орган',
          sourceUid: '42fd59f8-cea9-41f8-9fad-f53c74aec567',
          columnUids: ['a1b4db31-10ae-4864-8301-f7a66bca102f'],
          dictionarySopTest: true,
          key: 'OKTMO',
          value: 'name',
        },
      },
      address: '${address}',
      refs: {
        address: 'pd3.value',
      },
    },
    value: '',
    visited: false,
  } as InformationCenterPfr;
};

describe('InformationCenterPfrContainerComponent', () => {
  let component: InformationCenterPfrContainerComponent;
  let fixture: ComponentFixture<InformationCenterPfrContainerComponent>;
  let screenService: ScreenService;
  let sopService: SopService;
  const mockData: InformationCenterPfr = getComponentJson();
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        InformationCenterPfrContainerComponent,
        MockComponent(InformationCenterPfrFullComponent),
        MockComponent(InformationCenterPfrSimpleComponent),
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
        { provide: SopService, useClass: SopServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterPfrContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    sopService = TestBed.inject(SopService);
    screenService.component = mockData as ComponentDto;
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

    it('should be call changeForm from epgu-constructor-information-center-pfr-full', () => {
      jest.spyOn(component, 'changeForm');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-pfr-full'),
      );
      debugEl.triggerEventHandler('formChangeEvent', {});

      expect(component.changeForm).toHaveBeenCalled();
    });

    it('should be call changeForm from epgu-constructor-information-center-pfr-simple', () => {
      const mockDataWithSimple: InformationCenterPfr = getComponentJson({
        attrs: { simple: { items: [{}] }},
      } as Partial<InformationCenterPfr>);
      screenService.component = mockDataWithSimple as ComponentDto;
      fixture.detectChanges();
      jest.spyOn(component, 'changeForm');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-pfr-simple'),
      );
      debugEl.triggerEventHandler('formChangeEvent', {});

      expect(component.changeForm).toHaveBeenCalled();
    });
  });

  describe('fetchDictionary', () => {
    it('should be call fetchDictionary', () => {
      jest.spyOn(component, 'fetchDictionary');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-pfr-full'),
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
      screenService.component = mockData as ComponentDto;

      expect(component.fetchDictionary).toBeCalledTimes(0);
    });

    it('should be not set CashedValue', () => {
      jest.spyOn(component, 'fetchDictionary');
      mockData.value = JSON.stringify({});
      screenService.component = mockData as ComponentDto;

      expect(component.fetchDictionary).toBeCalledTimes(0);
    });
  });
});
