import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { InformationCenterFullComponent } from './information-center-full.component';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { Full } from '../../information-center.models';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ConstructorLookupModule } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { DictionaryConditions } from '@epgu/epgu-constructor-types';

describe('InformationCenterFullComponent', () => {
  let component: InformationCenterFullComponent;
  let fixture: ComponentFixture<InformationCenterFullComponent>;
  const itemsMock: Full = {
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
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterFullComponent],
      imports: [
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorLookupModule),
      ],
      providers: [UnsubscribeService, FormBuilder],
    })
      .overrideComponent(InformationCenterFullComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterFullComponent);
    component = fixture.componentInstance;
    component.items = itemsMock;
    component.territoryDictionary = [];
    component.districtDictionary = [];
    component.cityDistrictDictionary = [];
    component.regionDictionary = [];
    component.cachedValue = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initForm', () => {
    it('should init form without cachedValue', () => {
      expect(component.pfrForm.value).toEqual({
        region: null,
        district: null,
        cityDistrict: null,
        territory: null,
      });
    });
  });

  describe('handleSelect', () => {
    it('should be call formChangeEvent', () => {
      jest.spyOn(component.formChangeEvent, 'emit');
      jest.spyOn(component, 'handleSelect');
      const debugEl = fixture.debugElement.query(By.css('epgu-cf-ui-constructor-constructor-lookup'));
      debugEl.triggerEventHandler('changed', {});

      expect(component.formChangeEvent.emit).toHaveBeenCalled();
      expect(component.handleSelect).toHaveBeenCalled();
    });
  });
});
