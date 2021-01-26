import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { By } from '@angular/platform-browser';

import { InformationCenterPfrContainerComponent } from './information-center-pfr-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { DictionaryApiService } from '../../../../shared/services/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary-api/dictionary-api.service.stub';
import { InformationCenterPfrSimpleComponent } from '../component/information-center-pfr-short/information-center-pfr-simple.component';
import { InformationCenterPfrFullComponent } from '../component/information-center-pfr-full/information-center-pfr-full.component';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { ConstructorDropdownModule } from '../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ScreenContainerModule } from '../../../../../shared/components/screen-container/screen-container.module';
import { ScreenPadModule } from '../../../../../shared/components/screen-pad/screen-pad.module';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { InformationCenterPfr } from '../information-center-pfr.models';

describe('InformationCenterPfrContainerComponent', () => {
  let component: InformationCenterPfrContainerComponent;
  let fixture: ComponentFixture<InformationCenterPfrContainerComponent>;
  let screenService: ScreenService;
  const mockData: InformationCenterPfr = {
    id: 'dict55',
    type: UniqueScreenComponentTypes.informationCenterPfr,
    label: 'ПФР',
    attrs: {
      dictionaryType: 'TO_PFR',
      simple: { items: [], label: 'LABEL', html: '<p>HTML</p>' },
      full: {
        region: { label: 'Регион', attributeName: 'parent_attr', condition: 'CONTAINS' },
        district: {
          label: 'Район (Административный центр)',
          attributeName: 'parent_attr',
          condition: 'EQUALS',
        },
        territory: {
          label: 'Территориальный орган',
          attributeName: 'parent_attr',
          condition: 'CONTAINS',
        },
      },
    },
    value: '',
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
        MockModule(ScreenContainerModule),
        MockModule(ScreenPadModule),
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterPfrContainerComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
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

    it('should be call changeForm from epgu-constructor-information-center-pfr-full', () => {
      jest.spyOn(component, 'changeForm');
      const debugEl = fixture.debugElement.query(
        By.css('epgu-constructor-information-center-pfr-full'),
      );
      debugEl.triggerEventHandler('formChangeEvent', {});

      expect(component.changeForm).toHaveBeenCalled();
    });

    it('should be call changeForm from epgu-constructor-information-center-pfr-simple', () => {
      const mockDataWithSimple: InformationCenterPfr = {
        id: 'dict55',
        type: UniqueScreenComponentTypes.informationCenterPfr,
        label: 'ПФР',
        attrs: {
          dictionaryType: 'TO_PFR',
          simple: { items: [{} as any], label: 'LABEL', html: '<p>HTML</p>' },
          full: {
            region: { label: 'Регион', attributeName: 'parent_attr', condition: 'CONTAINS' },
            district: {
              label: 'Район (Административный центр)',
              attributeName: 'parent_attr',
              condition: 'EQUALS',
            },
            territory: {
              label: 'Территориальный орган',
              attributeName: 'parent_attr',
              condition: 'CONTAINS',
            },
          },
        },
        value: '',
      };
      screenService.component = mockDataWithSimple;
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
  });
});
