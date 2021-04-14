import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';

import {
  ComponentActionDto,
  DTOActionAction,
} from '../../../../form-player/services/form-player-api/form-player-api.types';
import { DefaultUniqueScreenWrapperComponent } from './default-unique-screen-wrapper.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ScreenContainerComponent } from '../../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../../shared/components/base-components/page-name/page-name.component';
import { ScreenPadComponent } from '../../../../shared/components/screen-pad/screen-pad.component';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { AnswerButtonComponent } from '../../../../shared/components/answer-button/answer-button.component';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../../core/services/logger/logger.service.stub';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { BaseModule } from '../../../../shared/base.module';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { configureTestSuite } from 'ng-bullet';

const componentActionDtoSample1: ComponentActionDto = {
  label: 'label1',
  value: 'value1',
  color: 'white',
  action: DTOActionAction.editEmail,
};

describe('DefaultUniqueScreenWrapperComponent', () => {
  let component: DefaultUniqueScreenWrapperComponent;
  let fixture: ComponentFixture<DefaultUniqueScreenWrapperComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MockModule(EpguLibModule),
        UserInfoLoaderModule,
        ScreenButtonsModule,
        BaseModule,
      ],
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
        CurrentAnswersService,
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
    component.screenButtons = [];
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
