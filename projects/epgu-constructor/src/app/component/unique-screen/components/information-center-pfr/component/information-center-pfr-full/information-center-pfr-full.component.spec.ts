import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { InformationCenterPfrFullComponent } from './information-center-pfr-full.component';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { Full } from '../../information-center-pfr.models';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ConstructorLookupModule } from '../../../../../../shared/components/constructor-lookup/constructor-lookup.module';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformationCenterPfrFullComponent],
      imports: [
        MockModule(BaseModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorLookupModule),
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
  });

  describe('handleSelect', () => {
    it('should be call formChangeEvent', () => {
      jest.spyOn(component.formChangeEvent, 'emit');
      jest.spyOn(component, 'handleSelect');
      const debugEl = fixture.debugElement.query(By.css('epgu-constructor-constructor-lookup'));
      debugEl.triggerEventHandler('changed', {});

      expect(component.formChangeEvent.emit).toHaveBeenCalled();
      expect(component.handleSelect).toHaveBeenCalled();
    });
  });
});
