import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockComponents, MockDirective } from 'ng-mocks';
import {
  ScreenContainerComponent,
  UnsubscribeService,
  ScreenPadComponent,
  LoggerService,
  LoggerServiceStub,
  ModalService,
  ModalServiceStub,
  EventBusService,
} from '@epgu/epgu-constructor-ui-kit';
import { DefaultUniqueScreenWrapperComponent } from './default-unique-screen-wrapper.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { AnswerButtonComponent } from '../../../../shared/components/answer-button/answer-button.component';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { BaseModule } from '../../../../shared/base.module';

import {
  ActionType,
  ButtonColor,
  ComponentActionDto,
  DTOActionAction,
} from '@epgu/epgu-constructor-types';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';

const componentActionDtoSample1: ComponentActionDto = {
  label: 'label1',
  value: 'value1',
  color: ButtonColor.WHITE,
  action: DTOActionAction.editEmail,
  type: ActionType.nextStep,
};

describe('DefaultUniqueScreenWrapperComponent', () => {
  let component: DefaultUniqueScreenWrapperComponent;
  let fixture: ComponentFixture<DefaultUniqueScreenWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserInfoLoaderModule, ScreenButtonsModule, BaseModule],
      declarations: [
        DefaultUniqueScreenWrapperComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          ScreenPadComponent,
          AnswerButtonComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        CertificateEaisdoService,
        CurrentAnswersService,
        EventBusService,
        EaisdoGroupCostService,
        UnsubscribeService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    })
      .overrideComponent(DefaultUniqueScreenWrapperComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultUniqueScreenWrapperComponent);
    component = fixture.componentInstance;
    component.header = 'Header';
    component.screenButtons = null;
    component.isLoading = false;
    component.isValid = true;
    component.showNav = true;
    fixture.detectChanges();
  });

  describe('button in the footer', () => {
    const selector = 'lib-button';

    it('should be show screenButtons', () => {
      component.screenButtons = [componentActionDtoSample1];
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });
  });
});
