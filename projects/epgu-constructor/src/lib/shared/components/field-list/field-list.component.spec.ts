import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';
import { FieldListComponent } from './field-list.component';
import {
  ImgPrefixerPipe,
  ObjectHelperService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { OutputHtmlModule } from '../output-html/output-html.module';
import { RankPipe, SafePipe } from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { EaisdoGroupCostService } from '../../services/eaisdo-group-cost/eaisdo-group-cost.service';
import { CurrentAnswersService } from '../../../screen/current-answers.service';
import { EaisdoStateTypes } from '../../../component/custom-screen/components/eaisdo-group-cost/eaisdo.interface';
import { JsonHelperService } from '../../../core/services/json-helper/json-helper.service';
import { CertificateEaisdoService } from '../../services/certificate-eaisdo/certificate-eaisdo.service';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { By } from '@angular/platform-browser';

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

  const mockPreparedData = [{
    groupName: 'groupName',
    visibilityLabel: 'wait',
    fields: [{
      label: 'label',
      value: '',
      rank: false,
    }]
  }];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [FieldListComponent, SafePipe, ImgPrefixerPipe, RankPipe],
      imports: [MockModule(OutputHtmlModule)],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        EaisdoGroupCostService,
        CertificateEaisdoService,
        UnsubscribeService,
        CurrentAnswersService,
        JsonHelperService,
        ObjectHelperService,
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
    expect(component).toBeTruthy();
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
  });

  describe('transformString()', () => {
    const str = '${id.value.value.placeholder}';
    it('should return transformed string, from passed string with placeholders', () => {
      currentAnswersService.state = { id: { value: { value: { placeholder: 'someValue' }}}};
      const result = component['transformString'](str);
      expect(result).toBe('someValue');
    });
  });

  describe('data item value html',() => {
    it('should render "-" when value is missing', async () => {
      component.preparedData = mockPreparedData;
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      const dataItemValue = fixture.debugElement.query(By.css('.data-item__value'));
      expect(dataItemValue.componentInstance.html).toEqual('-');
    });
  });
});
