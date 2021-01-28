import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';

import {
  ComponentActionDto,
  DTOActionAction,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ComponentWrapperComponent } from './component-wrapper.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ActionDirective } from '../../../shared/directives/action/action.directive';
import { ScreenContainerComponent } from '../../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../../shared/components/base-components/page-name/page-name.component';
import { ScreenPadComponent } from '../../../shared/components/screen-pad/screen-pad.component';
import { UserInfoLoaderModule } from '../../../shared/components/user-info-loader/user-info-loader.module';
import { AnswerButtonComponent } from '../../../shared/components/answer-button/answer-button.component';
import { LoggerService } from '../../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../../core/services/logger/logger.service.stub';

const componentActionDtoSample1: ComponentActionDto = {
  label: 'label1',
  value: 'value1',
  color: 'white',
  action: DTOActionAction.editEmail,
};

describe('ComponentWrapperComponent', () => {
  let component: ComponentWrapperComponent;
  let fixture: ComponentFixture<ComponentWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MockModule(EpguLibModule), UserInfoLoaderModule],
      declarations: [
        ComponentWrapperComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          ScreenPadComponent,
          AnswerButtonComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    })
      .overrideComponent(ComponentWrapperComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapperComponent);
    component = fixture.componentInstance;
    component.header = 'Header';
    component.actionButtons = [];
    component.screenActionButtons = [];
    component.isLoading = false;
    component.isShowActionBtn = false;
    component.isValid = true;
    component.nextStepAction = componentActionDtoSample1;
    component.showNav = true;
    component.submitLabel = '';
    fixture.detectChanges();
  });

  describe('isShowActionBtn property', () => {
    it('should be FALSE by default', () => {
      expect(component.isShowActionBtn).toBeFalsy();
    });
  });

  describe('button in the footer', () => {
    const selector = 'lib-button';

    it('should be show componentActionBtns', () => {
      component.isShowActionBtn = true;
      component.actionButtons = [componentActionDtoSample1];
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should be show screenActionBtns', () => {
      component.screenActionButtons = [componentActionDtoSample1];
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should be show displayContinueBtn', () => {
      component.submitLabel = 'Next';
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });
  });
});
