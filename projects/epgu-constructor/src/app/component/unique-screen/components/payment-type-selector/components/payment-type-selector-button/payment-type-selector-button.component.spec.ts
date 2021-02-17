import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CoreModule } from '../../../../../../core/core.module';
import { LocationService } from '../../../../../../core/services/location/location.service';
import { FormPlayerApiService } from '../../../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ComponentActionDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../../../shared/base.module';
import { AnswerButtonModule } from '../../../../../../shared/components/answer-button/answer-button.module';
import { ActionModule } from '../../../../../../shared/directives/action/action.module';
import { HtmlRemoverService } from '../../../../../../shared/services/html-remover/html-remover.service';
import { PaymentTypeSelectorButtonComponent } from './payment-type-selector-button.component';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentTypeSelectorButtonComponent],
      imports: [BaseModule, CoreModule, RouterTestingModule, AnswerButtonModule, ActionModule],
      providers: [
        LocationService,
        HtmlRemoverService,
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        CurrentAnswersService,
      ],
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
