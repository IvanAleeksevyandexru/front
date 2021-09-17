import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { CoreUiModule, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CoreModule } from '../../../../../../core/core.module';
import { 
  cachedValueMock,
  equipmentChoiceComponentMock,
  formValueMock,
  itemsWithMinAmountMock
} from '../../equipment-choice.mocks';
import { EquipmentChoiceFormValue, EquipmentChoiceRequestResult } from '../../equipment-choice.types';
import { EquipmentCategoryComponent } from '../equipment-category/equipment-category.component';
import { EquipmentChoiceComponent } from './equipment-choice.component';

describe('EquipmentChoiceComponent', () => {
  const equipmentChoiceRequestResult = new EquipmentChoiceRequestResult(equipmentChoiceComponentMock.attrs.result);
  let component: EquipmentChoiceComponent;
  let fixture: ComponentFixture<EquipmentChoiceComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EquipmentChoiceComponent,
        MockComponent(EquipmentCategoryComponent),
      ],
      imports: [
        CoreModule,
        MockModule(CoreUiModule),
        ReactiveFormsModule,
      ],
      providers: [
        UnsubscribeService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentChoiceComponent);
    component = fixture.componentInstance;
    component.component = equipmentChoiceComponentMock;
    component.cachedValue = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should create EquipmentChoiceRequestResult', () => {
      expect(component.equipmentChoiceRequestResult).toBeTruthy();
      expect(component.equipmentChoiceRequestResult).toBeInstanceOf(EquipmentChoiceRequestResult);
      expect(component.equipmentChoiceRequestResult).toEqual(equipmentChoiceRequestResult);
    });

    it('should set concServiceTypeIds if CONC_SERVICE_TYPE_IDS is exists', () => {
      expect(component.concServiceTypeIds).toBeTruthy();
      expect(component.concServiceTypeIds).toEqual(equipmentChoiceRequestResult.attrs.CONC_SERVICE_TYPE_IDS);
    });

    it('should init form', () => {
      expect(component.equipmentForm).toBeTruthy();
      expect(Object.keys(component.equipmentForm.controls).length).toBeGreaterThan(0);
    });

    it('should set isFormReady to TRUE', () => {
      expect(component.isFormReady).toBeTruthy();
    });

    it('should set values to form if cachedValues are exists', () => {
      component.cachedValue = cachedValueMock;
      component.ngOnInit();

      expect(component.equipmentForm.value).toEqual(formValueMock);
    });
  });

  describe('Form', () => {
    it('should validate minAmount', () => {
      component.component = itemsWithMinAmountMock;
      component.ngOnInit();

      expect(component.equipmentForm.valid).toBeFalsy();
    });

    it('should emit values on change', () => {
      jest.spyOn(component.updateEvent, 'emit');
      component.equipmentForm.patchValue(new EquipmentChoiceFormValue(cachedValueMock));

      expect(component.updateEvent.emit).toHaveBeenCalled();
    });
  });
});
