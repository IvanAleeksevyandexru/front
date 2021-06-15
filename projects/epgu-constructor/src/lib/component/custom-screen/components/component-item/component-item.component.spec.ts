import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents } from 'ng-mocks';
import {
  HelperTextComponent,
  ConfigService,
  ConfigServiceStub,
  ModalService,
  ModalServiceStub,
  LoggerService,
  LoggerServiceStub,
  FocusManagerService, FocusManagerServiceStub, CoreUiModule,
} from '@epgu/epgu-constructor-ui-kit';

import { ComponentItemComponent } from './component-item.component';
import { WebcamShootModule } from '../../../../shared/components/webcam-shoot/webcam-shoot.module';
import { LabelComponent } from '../../../../shared/components/base-components/label/label.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../shared/base.module';
import { CoreModule } from '../../../../core/core.module';
import { ClickableLabelModule } from '../../../../shared/directives/clickable-label/clickable-label.module';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { HintComponent } from '../../../../shared/components/base-components/hint/hint.component';
import { OPTIONAL_FIELD } from '@epgu/epgu-constructor-ui-kit';

describe('ComponentItemComponent', () => {
  let component: ComponentItemComponent;
  let fixture: ComponentFixture<ComponentItemComponent>;
  const mockComponent = {
    id: 'fakeId',
    label: 'fake label',
    attrs: {
      labelHint: 'fake labelHint',
      clarifications: 'fake clarifications'
    },
    required: true
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ComponentItemComponent,
        MockComponents(LabelComponent, HelperTextComponent, HintComponent)
      ],
      imports: [
        CoreModule,
        CoreUiModule,
        BaseModule,
        RouterTestingModule,
        WebcamShootModule,
        ClickableLabelModule,
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: FocusManagerService, useClass: FocusManagerServiceStub },
        CurrentAnswersService,
      ],
    }).overrideComponent(ComponentItemComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentItemComponent);
    component = fixture.componentInstance;
    component.control =  new FormControl();
    component.component = mockComponent as any;
    fixture.detectChanges();
  });

  describe('epgu-constructor-label', () => {
    const selector = 'epgu-constructor-label';

    it('check if show', () => {
      expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
      component.disableLabel = true;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeNull();
    });

    it('check properties', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.isTextHelper).toBeUndefined();
      expect(debugEl.componentInstance.tips).toBe('fake labelHint');
      expect(debugEl.componentInstance.label).toBe('fake label');
      expect(debugEl.componentInstance.clarifications).toBe('fake clarifications');
      expect(debugEl.componentInstance.largeFontSize).toBeFalsy();
    });
  });

  it('check uiError with description', () => {
    component.control.setErrors({ msg: 'fake error', desc: 'fake desc' });
    component.control.markAsTouched();
    component.ngOnChanges();
    expect(component.hasUiError).toBeTruthy();
    expect(component.hasErrors).toBeTruthy();
    expect(component.isShowErrors).toBeTruthy();
    expect(component.hasServerError).toBeFalsy();

    fixture.detectChanges();
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-output-html'));
    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.html).toBe('fake desc');
    expect(debugEl.componentInstance.clarifications).toBe('fake clarifications');
  });

  describe('hasInfo block', () => {
    const hintSelector = 'epgu-constructor-hint';
    const helperTextSelector = 'epgu-constructor-helper-text';

    it('is show', () => {
      component.component = { ...mockComponent, attrs: {}} as any;
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.hasInfo).toBeFalsy();
      expect(fixture.debugElement.query(By.css(hintSelector))).toBeFalsy();
      expect(fixture.debugElement.query(By.css(helperTextSelector))).toBeFalsy();

      component.component.attrs = { hint: 'foo' };
      component.ngOnChanges();
      fixture.detectChanges();
      expect(component.hasInfo).toBeTruthy();
      expect(fixture.debugElement.query(By.css(hintSelector))).toBeDefined();
      expect(fixture.debugElement.query(By.css(helperTextSelector))).toBeDefined();
    });

    it('check isHelperTextVisible', () => {
      component.component = { type: 'CheckBox', required: false } as any;
      component.ngOnChanges();
      expect(component.isHelperTextVisible).toBeFalsy();

      component.component = { required: false } as any;
      component.ngOnChanges();
      expect(component.isHelperTextVisible).toBeTruthy();
      expect(component.customUnRecLabel).toBe(OPTIONAL_FIELD);
    });
  });
});
