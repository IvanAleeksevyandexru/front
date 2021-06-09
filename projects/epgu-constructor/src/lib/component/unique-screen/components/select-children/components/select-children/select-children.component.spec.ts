import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from '@epgu/epgu-lib';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

import { SelectChildrenComponent } from './select-children.component';
import { CoreModule } from '../../../../../../core/core.module';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { SelectChildrenItemComponent } from '../select-children-item/select-children-item.component';
import { SelectChildrenItemWrapperComponent } from '../select-children-item-wrapper/select-children-item-wrapper.component';
import { BaseModule } from '../../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CloneButtonModule } from '../../../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListModule } from '../../../../../custom-screen/components-list.module';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { ModalService } from '../../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { componentMock } from './mocks/select-children.mock';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { RefRelationService } from '../../../../../../shared/services/ref-relation/ref-relation.service';
import { DictionaryToolsService } from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { configureTestSuite } from 'ng-bullet';

describe('SelectChildrenComponent', () => {
  let component: SelectChildrenComponent;
  let fixture: ComponentFixture<SelectChildrenComponent>;
  let eventBusService: EventBusService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectChildrenComponent,
        SelectChildrenItemComponent,
        SelectChildrenItemWrapperComponent,
      ],
      imports: [
        CoreModule,
        RouterTestingModule,
        ReactiveFormsModule,
        BaseModule,
        BaseComponentsModule,
        ScreenPadModule,
        CloneButtonModule,
        ConstructorDropdownModule,
        ComponentsListModule,
      ],
      providers: [
        UnsubscribeService,
        HealthService,
        EventBusService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
        DatesToolsService,
        RefRelationService,
        DictionaryToolsService,
      ],
    })
      .overrideComponent(SelectChildrenComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenComponent);
    eventBusService = TestBed.inject(EventBusService);
    component = fixture.componentInstance;
    component.addSectionLabel = 'Add';
    component.cachedValue = null;
    component.component = componentMock;
    component.errors = {};
    fixture.detectChanges();
  });

  describe('handleSelect()', () => {
    it('should be call handleSelect()', () => {
      jest.spyOn(component, 'handleSelect');
      component.handleSelect({ ai15_0: 'new' }, 0);

      expect(component.handleSelect).toBeCalledTimes(2);
    });

    it('should be call passDataToSend()', () => {
      jest.spyOn(component, 'passDataToSend');
      component.handleSelect({}, 0);

      expect(component.passDataToSend).toHaveBeenCalled();
    });
  });

  describe('removeChild()', () => {
    it('should be remove child', () => {
      fixture.detectChanges();
      component.removeChild(0);

      expect(component.items.length).toBe(0);
    });
  });

  describe('createNewChild()', () => {
    it('should be return new child', () => {
      const newChild = component.createNewChild();

      expect(newChild['ai15_6']).toBeTruthy();
    });
  });

  describe('getRefFromComponent()', () => {
    it('should be return ref', () => {
      const ref = component.getRefFromComponent('id');

      expect(ref).toBe('ai15_0');
    });
  });

  describe('addMoreChild()', () => {
    it('should be call addMoreChild() after initStartValues()', () => {
      console.log('test01', component.selectChildrenForm.controls.length);
      jest.spyOn(component, 'addMoreChild');
      component.initStartValues();

      expect(component.addMoreChild).toHaveBeenCalled();
    });

    it('should be call addMoreChild() after emit cloneButtonClickEvent', () => {
      jest.spyOn(component, 'addMoreChild');
      eventBusService.emit('cloneButtonClickEvent');

      expect(component.addMoreChild).toHaveBeenCalled();
    });

    // TODO: понять как получить динамические элементы
    xit('cloneButtonClickEvent should not make invalid form valid', () => {
      let selector = 'epgu-cf-ui-constructor-constructor-dropdown';
      const childId = component.items[0].controlId;
      const itemToSelect = component.itemsToSelect[0];
      const childElement = fixture.debugElement.query(By.css(selector));
      childElement.triggerEventHandler('changed', itemToSelect);
      const control = component.selectChildrenForm.get(childId);
      control.setValue(itemToSelect);
      expect(control.valid).toBeTruthy();
      fixture.detectChanges();
      expect(control.valid).toBeFalsy();
      selector = 'epgu-constructor-masked-input[ng-reflect-id="rfPasportSeries"]';
      const rfPasportSeriesElement = fixture.debugElement.query(By.css(selector));
      rfPasportSeriesElement.context.control.setValue('3');
      expect(control.valid).toBeFalsy();
      eventBusService.emit('cloneButtonClickEvent');
      expect(control.valid).toBeFalsy();
    });
  });

  describe('clone button', () => {
    const selector = 'epgu-constructor-clone-button';
    it('should be show clone button', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('should be not show clone button', () => {
      component.isSingleChild = true;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();
    });

    it('should be not disabled clone button', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.disabled).toBe(false);
    });

    it('should be disabled clone button', () => {
      component.repeatAmount = -1;
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.disabled).toBe(true);
    });
  });

  describe('updateCurrentAnswerService', () => {
    it('should call updateCurrentAnswerServiceValidationEvent', () => {
      jest.spyOn(component.updateCurrentAnswerServiceValidationEvent, 'emit');
      component.updateCurrentAnswerServiceValidation();

      expect(component.updateCurrentAnswerServiceValidationEvent.emit).toHaveBeenCalled();
    });

    it('should call updateCurrentAnswerServiceValidation', () => {
      const spy = jest.spyOn(component, 'updateCurrentAnswerServiceValidation');
      component.updateItemValueAndValidity(component.items[0].controlId);
      component.selectChildrenForm.get(component.items[0].controlId).setValue('child');
      expect(spy).toBeCalledTimes(3);
    });

    it('should call updateCurrentAnswerServiceStateEvent', () => {
      jest.spyOn(component.updateCurrentAnswerServiceStateEvent, 'emit');
      component.passDataToSend([]);

      expect(component.updateCurrentAnswerServiceStateEvent.emit).toHaveBeenCalled();
    });
  });
});
