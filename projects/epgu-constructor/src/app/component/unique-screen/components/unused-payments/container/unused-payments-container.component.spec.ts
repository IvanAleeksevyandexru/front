import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockComponent, MockModule } from 'ng-mocks';

import {
  CachedAnswersDto,
  ComponentAttrsDto,
  ComponentDto,
} from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { RadioTaxComponent } from '../../../../../shared/components/radio-tax/radio-tax.component';
import { UnusedPaymentInterface } from '../unused-payment.interface';
import { UnusedPaymentsContainerComponent } from './unused-payments-container.component';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { UnusedPaymentsComponent } from '../component/unused-payments.component';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
import { configureTestSuite } from 'ng-bullet';

describe('UnusedPaymentsContainerComponent', () => {
  let component: UnusedPaymentsContainerComponent;
  let fixture: ComponentFixture<UnusedPaymentsContainerComponent>;
  let screenService: ScreenService;

  const mockComponent: ComponentDto = {
    attrs: {
      image: { src: 'https://gu-st.ru/content/catalog/new/divorce_3_e-signature.svg' },
    } as ComponentAttrsDto,
    label: 'labelComponent',
    type: '',
    id: '12',
    value: '',
  };

  const cachedAnswersDto: CachedAnswersDto = {
    id: { value: '', visited: false },
  };

  const paymentsDataMock: UnusedPaymentInterface[] = [
    { uin: '123', payDate: 123123, amount: 123, link: 'sdf' },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        UnusedPaymentsContainerComponent,
        MockComponent(UnusedPaymentsComponent),
        MockComponent(RadioTaxComponent),
      ],
      imports: [MockModule(DefaultUniqueScreenWrapperModule)],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        CachedAnswersService,
        UtilsService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockComponent));
    jest.spyOn(screenService, 'cachedAnswers$', 'get').mockReturnValue(of(cachedAnswersDto));
    fixture = TestBed.createComponent(UnusedPaymentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('check', () => {
    expect(component).toBeTruthy();
  });
});
