import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
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
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { CloneButtonModule } from '../../../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '../../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ComponentsListModule } from '../../../../../shared/components/components-list/components-list.module';
import { ComponentDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ItemStatus } from '../../select-children.models';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { ModalService } from '../../../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../../../modal/modal.service.stub';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';

describe('SelectChildrenComponent', () => {
  let component: SelectChildrenComponent;
  let fixture: ComponentFixture<SelectChildrenComponent>;
  let eventBusService: EventBusService;
  let componentMock: ComponentDto = {
    id: 'ai19',
    type: 'ChildrenListAbove14',
    label: '',
    attrs: {
      components: [
        {
          id: 'ai19_0',
          type: 'StringInput',
          label: 'Идентификатор',
          attrs: {
            hidden: true,
            fields: [{ fieldName: 'id' }],
            validation: [
              {
                type: 'RegExp',
                value: '.+',
                ref: '',
                dataType: '',
                condition: '',
                errorMsg: 'Поле не может быть пустым',
              },
            ],
          },
          value: '',
          required: true,
        },
        {
          id: 'ai19_6',
          type: 'RadioInput',
          label: 'Ребенок новый?',
          attrs: {
            hidden: true,
            fields: [{ fieldName: 'isNew' }],
          },
          value: '',
          required: true,
        },
      ],
    },
    value: '[]',
    required: true,
  };

  beforeEach(() => {
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
        CurrentAnswersService
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
    component.selectChildrenForm = new FormGroup({ child1: new FormControl(null) });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSelect()', () => {
    it('should be call handleSelect()', () => {
      jest.spyOn(component, 'handleSelect');
      component.handleSelect({ ai19_0: 'new' }, 0);

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
      component.items = [{ controlId: 'child1' }];
      fixture.detectChanges();
      component.removeChild(0);

      expect(component.items.length).toBe(0);
    });
  });

  describe('createNewChild()', () => {
    it('should be return new child', () => {
      const newChild = component.createNewChild();

      expect(newChild['ai19_6']).toBeTruthy();
    });
  });

  describe('getRefFromComponent()', () => {
    it('should be return ref', () => {
      const ref = component.getRefFromComponent('id');

      expect(ref).toBe('ai19_0');
    });
  });

  describe('addMoreChild()', () => {
    it('should be call addMoreChild() after initStartValues()', () => {
      jest.spyOn(component, 'addMoreChild');
      component.initStartValues();

      expect(component.addMoreChild).toHaveBeenCalled();
    });

    it('should be call addMoreChild() after emit cloneButtonClickEvent', () => {
      jest.spyOn(component, 'addMoreChild');
      eventBusService.emit('cloneButtonClickEvent');

      expect(component.addMoreChild).toHaveBeenCalled();
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
      jest.spyOn(component, 'updateCurrentAnswerServiceValidation');
      component.updateItemValidationStatus(ItemStatus.valid, 'child1');
      component.selectChildrenForm.get('child1').setValue('child');

      expect(component.updateCurrentAnswerServiceValidation).toBeCalledTimes(2);
    });

    it('should call updateCurrentAnswerServiceStateEvent', () => {
      jest.spyOn(component.updateCurrentAnswerServiceStateEvent, 'emit');
      component.passDataToSend([]);

      expect(component.updateCurrentAnswerServiceStateEvent.emit).toHaveBeenCalled();
    });
  });
});
