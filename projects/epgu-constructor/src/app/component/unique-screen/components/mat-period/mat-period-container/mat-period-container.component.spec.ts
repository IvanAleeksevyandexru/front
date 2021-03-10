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
import { FormValue, MatPeriod } from '../mat-period.models';
import { CachedAnswersDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';

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
  const mockCachedAnswers: CachedAnswersDto = {
    dict555: {
      value: JSON.stringify({
        paymentType: 'one',
        amount: '234,00',
        startPayment: null,
        finishPayment: null,
        paymentDate: '10.03.2021',
      }),
      visited: true,
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MatPeriodContainerComponent,
        MockComponent(MatPeriodFormComponent),
        MockComponent(MatPeriodDescriptionComponent),
      ],
      imports: [MockModule(DefaultUniqueScreenWrapperModule), MockModule(ScreenPadModule)],
      providers: [{ provide: ScreenService, useClass: ScreenServiceStub }, CurrentAnswersService],
    })
      .overrideComponent(MatPeriodContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatPeriodContainerComponent);
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockData));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cachedValue$', () => {
    it('should return cached value', () => {
      jest.spyOn(screenService, 'cachedAnswers$', 'get').mockReturnValue(of(mockCachedAnswers));
      component.cachedValue$.subscribe((value) => {
        expect(value).toEqual({
          paymentType: 'one',
          amount: '234,00',
          startPayment: null,
          finishPayment: null,
          paymentDate: '10.03.2021',
        });
      });
    });
  });

  describe('updateState', () => {
    const data: FormValue = {
      data: {
        paymentType: 'month',
        amount: '2,00',
        startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
        finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
        paymentDate: '23',
      },
      isValid: true,
    };

    it('should be update currentAnswersService', () => {
      component.updateState(data);
      expect(component.currentAnswersService.state).toEqual(data.data);
      expect(component.currentAnswersService.isValid).toBeTruthy();
    });

    it('should be update paymentType', () => {
      component.updateState(data);
      expect(component.paymentType).toBe('month');
    });

    it('should be update description', () => {
      component.updateState(data);
      expect(component.balanceAmount).toBe(4);
      expect(component.durationAmount).toBe(2);
    });
  });

  describe('isValidForm', () => {
    it('should be return valid', () => {
      const data: FormValue = {
        data: {
          paymentType: 'month',
          amount: '2,00',
          startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
          finishPayment: { text: 'январь 2021', id: 1, date: '01.01.2021', value: 1 },
          paymentDate: '23',
        },
        isValid: true,
      };
      component.updateState(data);
      expect(component.currentAnswersService.isValid).toBeTruthy();
    });

    it('should be return invalid', () => {
      const data: FormValue = {
        data: {
          paymentType: 'month',
          amount: '2,00',
          startPayment: { text: 'декабрь 2020', id: 0, date: '01.12.2020', value: 0 },
          finishPayment: null,
          paymentDate: '23',
        },
        isValid: true,
      };
      component.updateState(data);
      expect(component.currentAnswersService.isValid).toBeFalsy();
    });

    it('should be return valid if payment type one', () => {
      const data: FormValue = {
        data: {
          paymentType: 'one',
          amount: '2,00',
          startPayment: null,
          finishPayment: null,
          paymentDate: '23',
        },
        isValid: true,
      };
      component.updateState(data);
      expect(component.currentAnswersService.isValid).toBeTruthy();
    });
  });
});
