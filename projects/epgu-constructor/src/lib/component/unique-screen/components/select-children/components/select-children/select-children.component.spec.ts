import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

import { SelectChildrenComponent } from './select-children.component';
import { CoreModule } from '../../../../../../core/core.module';
import {
  CoreUiModule,
  LoggerService,
  LoggerServiceStub,
  UnsubscribeService,
  HealthService,
  EventBusService,
  MemoModule,
} from '@epgu/epgu-constructor-ui-kit';
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
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ActionService } from '../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { componentMock } from './mocks/select-children.mock';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { RefRelationService } from '../../../../../../shared/services/ref-relation/ref-relation.service';
import { DictionaryToolsService } from '../../../../../../shared/services/dictionary/dictionary-tools.service';
import { configureTestSuite } from 'ng-bullet';
import { MockModule } from 'ng-mocks';
import { HtmlSelectService } from '../../../../../../core/services/html-select/html-select.service';
import { DisclaimerModule } from '../../../../../../shared/components/disclaimer/disclaimer.module';

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
        MockModule(CoreUiModule),
        RouterTestingModule,
        ReactiveFormsModule,
        BaseModule,
        BaseComponentsModule,
        ScreenPadModule,
        MemoModule,
        CloneButtonModule,
        ConstructorDropdownModule,
        ComponentsListModule,
        DisclaimerModule,
      ],
      providers: [
        UnsubscribeService,
        HealthService,
        EventBusService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        CurrentAnswersService,
        DatesToolsService,
        RefRelationService,
        DictionaryToolsService,
        HtmlSelectService,
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
    component.errors = [];
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should set start values', () => {
      jest.spyOn(component, 'initVariables');
      jest.spyOn(component, 'initStartValues');

      component.ngOnInit();

      expect(component.initVariables).toBeCalledTimes(1);
      expect(component.initStartValues).toBeCalledTimes(1);
    });

    describe('If obliged is TRUE', () => {
      it('should select the only children', () => {
        component.component = {
          arguments: {},
          attrs: {
            components: componentMock.attrs.components,
            obliged: true,
          },
          id: 'cl1',
          label: 'Добавить данные ребёнка',
          required: true,
          type: 'ChildrenList',
          presetValue:
            '[{"cl1_ri":false,"cl1_3":"Ильдарович","cl1_4":"2013-07-03T00:00:00.000Z","cl1_5":"M","cl1_id":"7544001","cl1_1":"Бобков","cl1_2":"Геннадий"}]',
        };

        jest.spyOn(component, 'addMoreChild');
        jest.spyOn(component, 'handleSelect');

        component.ngOnInit();

        expect(component.addMoreChild).toBeCalledWith(component.itemsToSelect[0]);
        expect(component.handleSelect).toBeCalledWith(component.itemsToSelect[0], 0);
      });

      it('should select new children if user have no children', () => {
        component.component = {
          arguments: {},
          attrs: {
            components: componentMock.attrs.components,
            obliged: true,
          },
          id: 'cl1',
          label: 'Добавить данные ребёнка',
          required: true,
          type: 'ChildrenList',
          value: '',
        };

        jest.spyOn(component, 'addMoreChild');
        jest.spyOn(component, 'handleSelect');

        component.ngOnInit();

        expect(component.addMoreChild).toBeCalledWith(component.itemsToSelect[0]);
        expect(component.handleSelect).toBeCalledWith(component.itemsToSelect[0], 0);
      });
    });
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

    it('should call updateCurrentAnswerServiceStateEvent via eventBusService', () => {
      const eventMock = {
        state: [],
        index: 0,
      };
      const eventEmitterSpy = jest.spyOn(eventBusService, 'emit');

      component.passDataToSend([], 0);
      expect(eventEmitterSpy).toBeCalledWith('updateCurrentAnswerServiceStateEvent', eventMock);
    });
  });
});
