import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { MockComponents, MockProviders } from 'ng-mocks';
import { By } from '@angular/platform-browser';
import { EaisdoGroupCostComponent } from './eaisdo-group-cost.component';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { PassportComponent } from '../../../../shared/components/add-passport/passport.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { EaisdoGroupCostService } from '../../../../shared/services/eaisdo-group-cost/eaisdo-group-cost.service';
import {
  ActionApiResponse,
  ActionType,
  DTOActionAction,
  EaisdoResponse,
} from '@epgu/epgu-constructor-types';
import { EaisdoStateTypes } from './eaisdo.interface';
import { CertificateEaisdoService } from '../../../../shared/services/certificate-eaisdo/certificate-eaisdo.service';

describe('EaisdoGroupCostComponent', () => {
  let component: EaisdoGroupCostComponent;
  let fixture: ComponentFixture<EaisdoGroupCostComponent>;
  let formService: ComponentsListFormService;
  let screenService: ScreenService;
  let eaisdoGroupCostService: EaisdoGroupCostService;
  let currentAnswersService: CurrentAnswersService;
  let actionService: ActionService;
  let control: FormGroup;
  let valueControl: FormControl;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EaisdoGroupCostComponent,
        MockComponents(ComponentItemComponent, PassportComponent),
      ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        EaisdoGroupCostService,
        CertificateEaisdoService,
        MockProviders(ComponentsListRelationsService, SuggestHandlerService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
      ],
    })
      .overrideComponent(EaisdoGroupCostComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    formService = TestBed.inject(ComponentsListFormService);
    screenService = TestBed.inject(ScreenService);
    eaisdoGroupCostService = TestBed.inject(EaisdoGroupCostService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    actionService = TestBed.inject(ActionService);
    screenService.buttons = [
      {
        type: ActionType.externalIntegration,
        action: DTOActionAction.externalIntegrationAction,
        label: 'label',
      },
    ];
    currentAnswersService.state = {};
    valueControl = new FormControl('foo');
    control = new FormGroup({
      id: new FormControl('someId'),
      value: valueControl,
      attrs: new FormControl('fake attrs'),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(EaisdoGroupCostComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(EaisdoGroupCostComponent);
  });

  it('should not render, as it\'s logical component', () => {
    const debugEl = fixture.debugElement.query(By.css('epgu-constructor-component-item'));
    expect(debugEl).toBeFalsy();
  });

  describe('ngOnInit', () => {
    it('should set component as control value', () => {
      expect(component.component).toBe(component.control.value);
    });
    it('should set eaisdoGroupCostService.currentState to \'wait\'', () => {
      expect(eaisdoGroupCostService.currentState).toBe(EaisdoStateTypes.wait);
    });
    it('should call actionService.handleExternalIntegrationAction()', () => {
      const spy = jest.spyOn(actionService, 'handleExternalIntegrationAction');
      component.ngOnInit();
      expect(spy).toBeCalled();
    });
  });

  describe('handleResponse', () => {
    it('should call setState()', () => {
      const spy = jest.spyOn(component, 'setState');
      const response = {
        errorList: [],
        responseData: {
          value: { error: null, errorType: null, responseType: null, responseData: null },
          type: null,
        },
      };
      component['handleResponse'](response);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setState', () => {
    const error: { [key: string]: string } = null;
    const responseType: string = null;
    const financialSource: string | unknown = null;
    const typeOfBudget: string | unknown = null;
    const responseData: ActionApiResponse<EaisdoResponse>['responseData'] = null;
    it('should set eaisdoGroupCostService.currentState()', () => {
      const result = EaisdoStateTypes.wait;
      component['setState'](error, responseType, financialSource, typeOfBudget, responseData);
      expect(eaisdoGroupCostService.currentState).toBe(result);
    });
    it('should call eaisdoGroupCostService.calculateState()', () => {
      const spy = jest.spyOn(eaisdoGroupCostService, 'calculateState');
      component['setState'](error, responseType, financialSource, typeOfBudget, responseData);
      expect(spy).toHaveBeenCalled();
    });
    it('should set currentAnswersService.state()', () => {
      const error: { [key: string]: string } = null;
      const responseType: string = null;
      const financialSource: string | unknown = null;
      const typeOfBudget: string | unknown = null;
      const responseData: ActionApiResponse<EaisdoResponse>['responseData'] = null;
      const result = {
        disabled: false,
        value: 'null',
        visited: true,
      };
      component['setState'](error, responseType, financialSource, typeOfBudget, responseData);
      expect(currentAnswersService.state[component.component.id]).toEqual(result);
    });
  });

  describe('handleError', () => {
    it('should call setState()', () => {
      const spy = jest.spyOn(component, 'setState');
      const response = {
        errorList: [],
        responseData: {
          value: { error: null, errorType: null, responseType: null, responseData: null },
          type: null,
        },
      };
      component['handleResponse'](response);
      expect(spy).toHaveBeenCalled();
    });
  });
});
