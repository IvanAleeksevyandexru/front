import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { PluralizePipe } from '@epgu/epgu-lib';
import { CoreUiModule, ScreenPadComponent, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { CoreModule } from '../../../../../../core/core.module';
import { equipmentCategoryMock, categoryFormTestValue } from '../../equipment-choice.mocks';
import { MultipleChoiceDictionaryComponent } 
  from '../../../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary/multiple-choice-dictionary.component';
import { ConstructorPlainInputComponent }
  from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { EquipmentCategoryComponent } from './equipment-category.component';

describe('EquipmentChoiceComponent', () => {
  let component: EquipmentCategoryComponent;
  let fixture: ComponentFixture<EquipmentCategoryComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EquipmentCategoryComponent,
        MockComponent(ConstructorPlainInputComponent),
        MockComponent(ScreenPadComponent),
        MockComponent(MultipleChoiceDictionaryComponent),
      ],
      imports: [
        CoreModule,
        MockModule(CoreUiModule),
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        PluralizePipe,
        UnsubscribeService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentCategoryComponent);
    component = fixture.componentInstance;
    component.category = equipmentCategoryMock;
    component.categoryFormGroup = new FormGroup({
      equipment: new FormControl(null)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set tip text if category minAmount not NULL', () => {
      expect(component.tipText).toBeUndefined();
      component.category = {
        id: 15,
        name: 'Оборудование для перевозки',
        equipment: [],
        minAmount: 2
      };

      component.ngOnInit();
      expect(component.tipText).toEqual('Минимум 2 варианта');
    });
    
    it('should preselect required equipment if concServiceTypeIds has been set', () => {
      expect(component.isEquipmentUnselectable).toBeFalsy();
      component.concServiceTypeIds = ['1468400'];
      component.ngOnInit();

      expect(component.isEquipmentUnselectable).toBeTruthy();
      expect(component.categoryFormGroup.value).toEqual(categoryFormTestValue);
    });
    
    it('should change additionalFields on control changes', () => {
      expect(component.itemsWithAdditionalFields.length).toBe(0);
      component.categoryFormGroup.patchValue(categoryFormTestValue);
      fixture.detectChanges();

      expect(component.itemsWithAdditionalFields.length).toBe(2);
    });
  });

  it('should return formControl', () => {
    jest.spyOn(component, 'getFormControl');

    expect(component.getFormControl('equipment')).toBeTruthy();
  });
});
