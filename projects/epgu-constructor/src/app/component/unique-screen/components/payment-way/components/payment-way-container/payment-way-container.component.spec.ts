import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule } from 'ng-mocks';
import { PaymentWayContainerComponent } from './payment-way-container.component';
import { PaymentWayComponent } from '../payment-way/payment-way.component';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../../public-api';

describe('PaymentWayContainerComponent', () => {
  let component: PaymentWayContainerComponent;
  let fixture: ComponentFixture<PaymentWayContainerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentWayContainerComponent,
        MockComponent(PaymentWayComponent)
      ],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(ScreenPadModule)
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentWayContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
