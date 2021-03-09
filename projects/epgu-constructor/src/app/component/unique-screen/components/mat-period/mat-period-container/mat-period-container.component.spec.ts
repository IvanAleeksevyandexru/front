import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs';

import { MatPeriodContainerComponent } from './mat-period-container.component';
import { MatPeriodFormComponent } from '../components/mat-period-form/mat-period-form.component';
import { MatPeriodDescriptionComponent } from '../components/mat-period-description/mat-period-description.component';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenPadModule } from '../../../../../shared/components/screen-pad/screen-pad.module';
import { UniqueScreenComponentTypes } from '../../../unique-screen-components.types';
import { MatPeriod } from '../mat-period.models';

describe('MatPeriodContainerComponent', () => {
  let component: MatPeriodContainerComponent;
  let fixture: ComponentFixture<MatPeriodContainerComponent>;
  let screenService: ScreenService;
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
  const mockData: MatPeriod = {
    id: 'dict55',
    type: UniqueScreenComponentTypes.matPeriod,
    label: 'mat period',
    attrs: {
      description: {
        balanceLabel: '',
        durationLabel: '',
      },
      components: mockComponents as any,
    },
    value: '',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MatPeriodContainerComponent,
        MockComponent(MatPeriodFormComponent),
        MockComponent(MatPeriodDescriptionComponent),
      ],
      imports: [MockModule(DefaultUniqueScreenWrapperModule), MockModule(ScreenPadModule)],
      providers: [{ provide: ScreenService, use: ScreenServiceStub }, CurrentAnswersService],
    })
      .overrideComponent(MatPeriodContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodContainerComponent);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockData))
    // screenService.component = mockData as any;

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
