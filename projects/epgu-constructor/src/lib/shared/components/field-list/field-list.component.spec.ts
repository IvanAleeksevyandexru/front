import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { FieldListComponent } from './field-list.component';
import { UnsubscribeService, UnsubscribeServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { OutputHtmlModule } from '../output-html/output-html.module';
import { RankPipe, SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { EaisdoStateTypes } from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { By } from '@angular/platform-browser';
import { EaisdoGroupCostServiceStub } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service.stub';
import { JsonHelperServiceStub } from '../../../core/services/json-helper/json-helper.service.stub';
import { ConfirmUserDataErrorType } from '../../../component/unique-screen/components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';

describe('FieldListComponent', () => {
  let component: FieldListComponent;
  let currentAnswersService: CurrentAnswersService;
  let fixture: ComponentFixture<FieldListComponent>;
  const dataMock = {
    attrs: {
      style: {
        group: 'mb-16',
        groupTitle: 'mb-12',
        value: '',
        label: 'mb-4',
        field: 'mb-16',
        list: '',
        divider: 'mb-32',
      },
      fieldGroups: [
        {
          groupName: '<h4 class=\'mb-12\'>Реквизиты сертификата</h4>',
          needDivider: true,
          fields: [{}],
        },
        {
          groupName: '<h5 class=\'mb-12\'>Детали оплаты программы</h5>',
          visibilityLabel: 'wait',
          fields: [{}],
        },
      ],
    },
    visited: true,
    label: '',
    type: '',
    value: '',
    id: '',
  };

  const mockPreparedData = [
    {
      groupName: 'groupName',
      visibilityLabel: 'wait',
      fields: [
        {
          label: 'label',
          value: '',
          rank: false,
        },
      ],
    },
  ];

  const mockError = {
    desc: 'Поле может содержать не более 10 символов',
    icon: 'red-line',
    title: 'Сократите количество символов',
    type: ConfirmUserDataErrorType.error,
  };

  const mockErrors = [
    {
      desc: 'Поле может содержать не более 10 символов',
      icon: 'red-line',
      title: 'Сократите количество символов',
      type: ConfirmUserDataErrorType.error,
    },
    {
      desc: 'Поле может содержать не более 10 символов',
      icon: 'red-line',
      title: 'Сократите количество символов',
      type: ConfirmUserDataErrorType.error,
    },
    {
      desc: 'Поле не может содержать буквы',
      icon: 'red-line',
      title: 'Удалите лишние символы',
      type: ConfirmUserDataErrorType.error,
    },
    {
      desc: 'Поле не может содержать цифры',
      icon: 'red-line',
      title: 'Удалите лишние символы',
      type: ConfirmUserDataErrorType.error,
    }
  ];

  const mockGroupedErrors = [
    {
      desc: 'Поле может содержать не более 10 символов',
      icon: 'red-line',
      title: 'Сократите количество символов',
      type: ConfirmUserDataErrorType.error,
    },
    {
      desc: 'Поле не может содержать буквы <br> Поле не может содержать цифры',
      icon: 'red-line',
      title: 'Удалите лишние символы',
      type: ConfirmUserDataErrorType.error,
    }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FieldListComponent, RankPipe],
      imports: [MockModule(OutputHtmlModule)],
      providers: [
        { provide: EaisdoGroupCostService, useClass: EaisdoGroupCostServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        MockProvider(CurrentAnswersService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    fixture = TestBed.createComponent(FieldListComponent);
    component = fixture.componentInstance;
    component.data = dataMock as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnChanges({});
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    it('should call "groupErrors()" if "isNeedToGroupErrors" is true and errors amount more than 1', () => {
      jest.spyOn<FieldListComponent, any>(component, 'groupErrors');
      component.data.attrs.isNeedToGroupErrors = true;
      component.data.value = JSON.stringify({
        errors: mockErrors,
      });
      fixture.detectChanges();

      component.ngOnChanges({
        data: new SimpleChange(null, 1, true)
      });

      expect(component['groupErrors']).toBeCalled();
    });

    it('should not call "groupErrors()" if "isNeedToGroupErrors" is false or errors amount less than 2', () => {
      jest.spyOn<FieldListComponent, any>(component, 'groupErrors');
      component.data.attrs.isNeedToGroupErrors = false;
      component.data.value = JSON.stringify({
        errors: mockErrors,
      });
      fixture.detectChanges();

      component.ngOnChanges({
        data: new SimpleChange(null, 1, true)
      });

      expect(component['groupErrors']).not.toBeCalled();

      component.data.attrs.isNeedToGroupErrors = true;
      component.data.value = JSON.stringify({
        errors: mockError,
      });
      fixture.detectChanges();

      component.ngOnChanges({
        data: new SimpleChange(null, 1, true)
      });

      expect(component['groupErrors']).not.toBeCalled();
    });
  });

  describe('epgu-constructor-output-html groupName', () => {
    const selector = 'epgu-constructor-output-html';

    it('html should be groupName', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.html).toBe('groupName');
    });

    it('clarifications should be data.attrs.clarifications', async () => {
      const clarifications = {
        clarification: {
          title: 'clarification title',
          text: 'clarification text',
          setting: {},
          type: 'clarification type',
          id: 'clarification id',
        }
      };
      component.data.attrs.clarifications = clarifications;
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.componentInstance.clarifications).toBe(clarifications);
    });

    it('ngClass should be style.groupTitle', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[0];
      expect(debugEl.attributes['ng-reflect-ng-class']).toBe('mb-12');
    });
  });

  describe('epgu-constructor-output-html field.label', () => {
    const selector = 'epgu-constructor-output-html';

    it('should create if field.label', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl).toBeTruthy();
    });

    it('html should be field.label', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.html).toBe('label');
    });

    it('clarifications should be data.attrs.clarifications', async () => {
      const clarifications = {
        clarification: {
          title: 'clarification title',
          text: 'clarification text',
          setting: {},
          type: 'clarification type',
          id: 'clarification id',
        }
      };
      component.data.attrs.clarifications = clarifications;
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.componentInstance.clarifications).toBe(clarifications);
    });

    it('ngClass should be style.label', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const debugEl = fixture.debugElement.queryAll(By.css(selector))[1];
      expect(debugEl.attributes['ng-reflect-ng-class']).toBe('mb-4');
    });
  });

  describe('calculateVisibility()', () => {
    it('should return true, if current fieldGroup item passed by index contain visibilityLabel and match currentEaisdoState', () => {
      component.currentEaisdoState = EaisdoStateTypes.wait;
      const result = component.calculateVisibility(1);
      expect(result).toBeTruthy();
    });
    it('should return false, if current fieldGroup item passed by index contain visibilityLabel and doesn\'t match currentEaisdoState', () => {
      component.currentEaisdoState = EaisdoStateTypes.errorBad;
      const result = component.calculateVisibility(1);
      expect(result).toBeFalsy();
    });
    it('should return true, if current fieldGroup item passed by index doesn\'t contain visibilityLabel', () => {
      const result = component.calculateVisibility(0);
      expect(result).toBeTruthy();
    });
    it('should return true if calculateVisibility(idx) != data.attrs.groupFields[idx]', () => {
      component.data.attrs.fieldGroups = undefined;
      expect(component.calculateVisibility(0)).toBeTruthy();
    });
  });

  describe('transformString()', () => {
    const str = '${id.value.value.placeholder}';
    it('should return transformed string, from passed string with placeholders', () => {
      currentAnswersService.state = { id: { value: { value: { placeholder: 'someValue' }}}};
      const result = component['transformString'](str);
      expect(result).toBe('someValue');
    });

    it('should return passed string if path is incorrectly specified', () => {
      currentAnswersService.state = { id: { value: { value: {}}}};
      const result2 = component['transformString'](str);
      expect(result2).toBe(str);
    });
  });

  describe('groupErrors()', () => {
    it('should group errors with only similar title and leave 1 similar error by title and description', () => {
      component.data.attrs.isNeedToGroupErrors = true;
      component.errors = mockErrors;
      fixture.detectChanges();

      component['groupErrors']();

      expect(component.errors).toEqual(mockGroupedErrors);
    });
  });

  describe('data item value html', () => {
    it('should render "-" when value is missing', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemValue.componentInstance.html).toEqual('-');
    });
  });
});
