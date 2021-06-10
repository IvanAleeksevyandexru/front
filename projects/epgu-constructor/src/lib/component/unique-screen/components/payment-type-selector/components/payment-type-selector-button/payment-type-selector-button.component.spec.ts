import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MockModule } from 'ng-mocks';

import { ComponentActionDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { BaseModule } from '../../../../../../shared/base.module';
import { AnswerButtonModule } from '../../../../../../shared/components/answer-button/answer-button.module';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';
import { PaymentTypeSelectorButtonComponent } from './payment-type-selector-button.component';
import { configureTestSuite } from 'ng-bullet';

describe('PaymentTypeSelectorButtonComponent', () => {
  let component: PaymentTypeSelectorButtonComponent;
  let fixture: ComponentFixture<PaymentTypeSelectorButtonComponent>;

  const applicantTypeMock = 'success';
  const actionMock = {
    label: 'На портале со скидкой 30%',
    value: '"На портале со скидкой 30%',
    type: 'nextStep',
    action: 'getNextScreen',
  } as ComponentActionDto;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      declarations: [PaymentTypeSelectorButtonComponent],
      imports: [MockModule(AnswerButtonModule), MockModule(ActionModule), MockModule(BaseModule)],
    })
      .overrideComponent(PaymentTypeSelectorButtonComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTypeSelectorButtonComponent);
    component = fixture.componentInstance;
    component.isErrorTemplate = false;
    component.applicantType = applicantTypeMock;
    component.action = actionMock;
    fixture.detectChanges();
  });

  it('should action button for error', () => {
    component.isErrorTemplate = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.screen-footer__btn'))).not.toBeNull();
  });
  it('should action button for success', () => {
    expect(fixture.debugElement.query(By.css('.answer-btn'))).not.toBeNull();
  });
});
