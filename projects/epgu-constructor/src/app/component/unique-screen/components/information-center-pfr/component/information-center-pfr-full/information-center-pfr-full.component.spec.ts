import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';

import { InformationCenterPfrFullComponent } from './information-center-pfr-full.component';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { Full, PfrAreaType } from '../../information-center-pfr.models';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { By } from '@angular/platform-browser';

describe('InformationCenterPfrFullComponent', () => {
  let component: InformationCenterPfrFullComponent;
  let fixture: ComponentFixture<InformationCenterPfrFullComponent>;
  const itemsMock: Full = {
    region: {
      label: 'Регион',
      attributeName: 'parent_attr',
      condition: 'CONTAINS',
    },
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterPfrFullComponent],
      imports: [
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorDropdownModule),
      ],
      providers: [UnsubscribeService, FormBuilder],
    })
      .overrideComponent(InformationCenterPfrFullComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationCenterPfrFullComponent);
    component = fixture.componentInstance;
    component.items = itemsMock;
    component.territoryDictionary = [];
    component.districtDictionary = [];
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
        territory: null,
      });
    });

    // it('should init form with cachedValue', () => {
    //   // jest.spyOn(component, 'cachedValue', ).mockReturnValue(JSON.stringify(mockCachedValue));
    //   component.cachedValue = JSON.stringify(mockCachedValue);
    //   fixture.detectChanges();
    //   expect(component.pfrForm.value).toEqual({
    //     region: mockCachedValue.region,
    //     district: mockCachedValue.district,
    //     territory: mockCachedValue.territory,
    //   });
    // });
  });

  describe('handleSelect', () => {
    it('should be call formChangeEvent', () => {
      jest.spyOn(component.formChangeEvent, 'emit');
      jest.spyOn(component, 'handleSelect');
      const debugEl = fixture.debugElement.query(By.css('epgu-constructor-constructor-dropdown'));
      debugEl.triggerEventHandler('changed', {});

      expect(component.formChangeEvent.emit).toHaveBeenCalled();
      expect(component.handleSelect).toHaveBeenCalled();
    });
  });
});
