import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { FieldListComponent } from './field-list.component';
import { UnsubscribeService, UnsubscribeServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { OutputHtmlModule } from '../output-html/output-html.module';
import { RankPipe, SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { EaisdoStateTypes } from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { By } from '@angular/platform-browser';
import { EaisdoGroupCostServiceStub } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service.stub';
import { JsonHelperServiceStub } from '../../../core/services/json-helper/json-helper.service.stub';
import { ConfirmUserDataErrorType } from '../../../component/unique-screen/components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { cloneDeep } from 'lodash';

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

  beforeEach(() => {
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
    it('should not render anything when value and label are empty', async () => {
      component.preparedData = cloneDeep(mockPreparedData);
      component.preparedData[0].fields[0].label = '';
      component.preparedData[0].fields[0].value = '';

      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemLabel = fixture.debugElement.query(By.css('.data-item__label'));
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemLabel).toBeNull();
      expect(dataItemValue).toBeNull();
    });

    it('should render value without label, when value exists and label is empty', async () => {
      component.preparedData = cloneDeep(mockPreparedData);
      component.preparedData[0].fields[0].label = '';
      component.preparedData[0].fields[0].value = 'foo';

      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemLabel = fixture.debugElement.query(By.css('.data-item__label'));
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemLabel).toBeNull();
      expect(dataItemValue).toBeTruthy();
      expect(dataItemValue.componentInstance.html).toEqual('foo');
    });

    it('should render label with "-", when label exists and value is empty', async () => {
      component.preparedData = cloneDeep(mockPreparedData);
      component.preparedData[0].fields[0].label = 'foo';
      component.preparedData[0].fields[0].value = '';

      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemLabel = fixture.debugElement.query(By.css('.data-item__label'));
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemLabel).toBeTruthy();
      expect(dataItemValue).toBeTruthy();
      expect(dataItemLabel.componentInstance.html).toEqual('foo');
      expect(dataItemValue.componentInstance.html).toEqual('-');
    });

    it('should render label with "-", when label exists and value is missing', async () => {
      component.preparedData = cloneDeep(mockPreparedData);
      component.preparedData[0].fields[0].label = 'foo';
      component.preparedData[0].fields[0].value = undefined;

      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemLabel = fixture.debugElement.query(By.css('.data-item__label'));
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemLabel).toBeTruthy();
      expect(dataItemValue).toBeTruthy();
      expect(dataItemLabel.componentInstance.html).toEqual('foo');
      expect(dataItemValue.componentInstance.html).toEqual('-');
    });

    it('should render label and value, when they exists', async () => {
      component.preparedData = cloneDeep(mockPreparedData);
      component.preparedData[0].fields[0].label = 'foo';
      component.preparedData[0].fields[0].value = 'bar';

      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemLabel = fixture.debugElement.query(By.css('.data-item__label'));
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemLabel).toBeTruthy();
      expect(dataItemValue).toBeTruthy();
      expect(dataItemLabel.componentInstance.html).toEqual('foo');
      expect(dataItemValue.componentInstance.html).toEqual('bar');
    });
  });
});
