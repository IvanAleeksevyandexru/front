import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { MatPeriodFormComponent } from './mat-period-form.component';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ConstructorDatePickerModule } from '../../../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ErrorModule } from '../../../../../../shared/components/error/error.module';
import { ConstructorPlainInputModule } from '../../../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../../../../../shared/components/constructor-masked-input/constructor-masked-input.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { FormBuilder } from '@angular/forms';
import { MemoModule } from '../../../../../../shared/pipes/memo/memo.module';
import { FilterPipe } from '../../pipe/filter.pipe';
import { DurationService } from '../../service/duration.service';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { ValidationService } from '../../../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../../shared/components/components-list/services/date-range/date-range.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';

describe('MatPeriodFormComponent', () => {
  let component: MatPeriodFormComponent;
  let fixture: ComponentFixture<MatPeriodFormComponent>;
  const mockComponents = {
    paymentType: {
      attrs: {
        label: 'paymentType',
      },
    },
    amount: {
      attrs: {
        maskOptions: {
          decimalSymbol: ',',
          allowDecimal: true,
        },
        validation: [
          {
            type: 'RegExp',
            value: '^.{0,5}$',
            errorMsg: 'Максимальная длина поля 5 символов',
          },
        ],
      },
      label: 'amount',
    },
    startPayment: {
      label: 'startPayment',
    },
    finishPayment: {
      label: 'finishPayment',
    },
    paymentDate: {
      attrs: {
        validation: [],
      },
      label: 'paymentDate',
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatPeriodFormComponent, FilterPipe],
      imports: [
        MockModule(ConstructorDropdownModule),
        MockModule(ConstructorDatePickerModule),
        MockModule(BaseComponentsModule),
        MockModule(ConstructorPlainInputModule),
        MockModule(ConstructorMaskedInputModule),
        MockModule(ErrorModule),
        MockModule(BaseModule),
        MockModule(MemoModule),
      ],
      providers: [
        FormBuilder,
        DurationService,
        DatesToolsService,
        ValidationService,
        DateRangeService,
        { provide: ScreenService, use: ScreenServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodFormComponent);
    component = fixture.componentInstance;
    component.cachedValue = {} as any;
    component.components = mockComponents as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
