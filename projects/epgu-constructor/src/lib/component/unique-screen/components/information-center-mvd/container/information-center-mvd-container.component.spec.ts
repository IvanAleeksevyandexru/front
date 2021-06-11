import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

import { InformationCenterMvdContainerComponent } from './information-center-mvd-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiService } from '../../../../../shared/services/dictionary/dictionary-api.service';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
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
import { ComponentsListRelationsService } from '../../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../../shared/services/date-range/date-range.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { configureTestSuite } from 'ng-bullet';
import { DTOActionAction } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../../shared/services/date-restrictions/date-restrictions.service';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { LoggerService } from '../../../../../core/services/logger/logger.service';

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

  configureTestSuite(() => {
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
      ],
      providers: [
        UnsubscribeService,
        UtilsService,
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
          title: 'Республика Адыгея',
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
          title: 'Республика Адыгея',
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
          title: 'Республика Адыгея',
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
          title: 'Республика Алтай',
          isLeaf: true,
          children: [],
          attributes: [],
          source: null,
          attributeValues: {},
        },
        id: '004',
        text: 'Республика Алтай',
      });
      expect(component.infoCenterList).toEqual(expectedValue);
    });
  });
});
