import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  ImgPrefixerModule,
  SafeModule,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { DenyReason, FinancialSourceType, Group } from '../../../../typings';
import { GroupItemComponent } from './group-item.component';
import { DenyReasonTitleComponent } from '../../../base/components/deny-reason-title/deny-reason-title.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { PluralizeModule, ToMoneyModule } from '@epgu/ui/pipes';
import { HttpClientModule } from '@angular/common/http';

const testGroup: Group = {
  uuid: '1234',
  name: 'testGroup',
  available: false,
  ageFrom: 0,
  ageTo: 14,
  size: '',
  dateBegin: null,
  dateEnd: null,
  hoursYear: 123,
  teachers: '',
  schedule: '',
  financingSources: [],
  orderFrom: '2020-02-23',
  orderTo: '2020-02-24',
  availableNextYearOrderFrom: null,
  availableNextYearOrderTo: null,
  denyReason: DenyReason.RegistrationClosed,
};

const testState = {
  nextSchoolYear: 'false',
  denyReason: JSON.stringify({
    currentYear: {
      registration_closed: {
        title: 'test title ${orderFrom}',
        text: '<h6 class="deny-reason-text">test text ${orderTo}</h6>',
      },
    },
    nextYear: {
      registration_closed: {
        title: 'test2 title ${orderFrom}',
        text: '<h6 class="deny-reason-text">test2 text ${orderTo}</h6>',
      },
    },
  }),
};

describe('GroupItemComponent', () => {
  let component: GroupItemComponent;
  let fixture: ComponentFixture<GroupItemComponent>;
  let stateQuery: MicroAppStateQueryStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BaseUiModule,
        ImgPrefixerModule,
        SafeModule,
        PluralizeModule,
        ToMoneyModule,
        HttpClientModule,
      ],
      declarations: [GroupItemComponent, DenyReasonTitleComponent],

      providers: [
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        DatesToolsService,
      ],
    })
      .overrideComponent(GroupItemComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupItemComponent);
    component = fixture.componentInstance;
    component.group = testGroup;
    testGroup.financingSources = [];
    stateQuery = TestBed.inject(MicroAppStateQuery);
    jest.spyOn(stateQuery, 'state', 'get').mockReturnValue(testState);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should set isNextSchoolYear', () => {
      jest
        .spyOn(stateQuery, 'state', 'get')
        .mockReturnValue({ testState, ...{ nextSchoolYear: 'true' }});
      expect(component.isNextSchoolYear).toBeFalsy();
      component.ngOnInit();
      expect(component.isNextSchoolYear).toBeTruthy();
    });
  });

  describe('set data()', () => {
    it('should correctly set sources cost', () => {
      const source = {
        cost: 15,
        monthlyCost: 30,
        sourceCode: FinancialSourceType.pfdod_certificate,
      };
      const source1 = { cost: 15, monthlyCost: 30, sourceCode: FinancialSourceType.budget };
      testGroup.financingSources.push(source1, source);

      component.data = testGroup;

      expect(component.sources.budget).toBe(15);
      expect(component.sources.pfdod_certificate).toBe(30);
    });

    it('should set paid cost if specefic financing source is present', () => {
      const source = { cost: 15, monthlyCost: 30, sourceCode: FinancialSourceType.paid };
      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paidCost).toBeTruthy();
    });

    it('should set paid cost if specefic financing source is present', () => {
      const source = { cost: 15, monthlyCost: 30, sourceCode: FinancialSourceType.private };
      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paidCost).toBeTruthy();
    });

    it('should set isMultiPaymentsInfoShown to true', () => {
      const source = { cost: 15, monthlyCost: 30, sourceCode: FinancialSourceType.private };
      const source1 = {
        cost: 15,
        monthlyCost: 30,
        sourceCode: FinancialSourceType.pfdod_certificate,
      };
      testGroup.financingSources.push(source, source1);

      component.data = testGroup;

      expect(component.isMultiPaymentsInfoShown).toBeTruthy();
    });

    it('should set paymentsInfo to Бесплатно', () => {
      const source = { cost: 0, monthlyCost: 0, sourceCode: FinancialSourceType.budget };
      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paymentsInfo).toBe('Бесплатно');
    });

    it('should set paymentsInfo to Бесплатно', () => {
      const source = { cost: 0, monthlyCost: 0, sourceCode: FinancialSourceType.none };
      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paymentsInfo).toBe('Бесплатно');
    });

    it('should set paymentsInfo to Сертификатом', () => {
      const source = { cost: 3, monthlyCost: 3, sourceCode: FinancialSourceType.pfdod_certificate };
      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paymentsInfo).toBe('Сертификатом');
    });

    it('should set paymentsInfo to Из личных средств', () => {
      const source = { cost: 3, monthlyCost: 3, sourceCode: FinancialSourceType.private };
      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paymentsInfo).toBe('Из личных средств');
    });

    it('should set paymentsInfo to Из личных средств', () => {
      const source = { cost: 3, monthlyCost: 3, sourceCode: FinancialSourceType.paid };

      testGroup.financingSources.push(source);
      component.data = testGroup;

      expect(component.paymentsInfo).toBe('Из личных средств');
    });

    it('should set paymentsInfo to combined value', () => {
      const source = { cost: 3, monthlyCost: 3, sourceCode: FinancialSourceType.paid };
      const source1 = {
        cost: 3,
        monthlyCost: 3,
        sourceCode: FinancialSourceType.pfdod_certificate,
      };
      const source2 = { cost: 0, monthlyCost: 0, sourceCode: FinancialSourceType.none };
      testGroup.financingSources.push(source, source1, source2);
      component.data = testGroup;

      expect(component.paymentsInfo).toBe('Бесплатно, сертификатом или из личных средств');
    });
  });

  describe('getDenyReasonMessage()', () => {
    beforeEach(() => {
      component.denyReasonMessage = null;
    });

    it('should be deny reason title for current year', () => {
      component.ngOnInit();

      expect(component.denyReasonMessage.text).toBe(
        '<h6 class="deny-reason-text">test text 24.02.2020</h6>',
      );
    });

    it('should be deny reason text for current year', () => {
      component.ngOnInit();

      expect(component.denyReasonMessage.title).toBe('test title 23.02.2020');
    });

    it('should be deny reason title for next year', () => {
      const testStateCopy = Object.assign({}, testState);
      testStateCopy.nextSchoolYear = 'true';
      jest.spyOn(stateQuery, 'state', 'get').mockReturnValue(testStateCopy);

      component.ngOnInit();

      expect(component.denyReasonMessage.title).toBe('test2 title 23.02.2020');
    });

    it('should be deny reason text for next year', () => {
      const testStateCopy = Object.assign({}, testState);
      testStateCopy.nextSchoolYear = 'true';
      jest.spyOn(stateQuery, 'state', 'get').mockReturnValue(testStateCopy);

      component.ngOnInit();

      expect(component.denyReasonMessage.text).toBe(
        '<h6 class="deny-reason-text">test2 text 24.02.2020</h6>',
      );
    });

    it('should be null if group is not set', () => {
      component.group = null;

      component.ngOnInit();

      expect(component.denyReasonMessage).toBeNull();
    });

    it('should be null if group is available', () => {
      component.group.available = true;

      component.ngOnInit();

      expect(component.denyReasonMessage).toBeNull();
    });

    it('should be null if group is available', () => {
      component.group.denyReason = null;

      component.ngOnInit();

      expect(component.denyReasonMessage).toBeNull();
    });

    it('should be null if no available property is present', () => {
      delete component.group.available;

      component.ngOnInit();

      expect(component.denyReasonMessage).toBeNull();
    });
  });

  it('getCost', () => {
    let item = { cost: 9600, monthlyCost: 1200, sourceCode: FinancialSourceType.pfdod_certificate };
    expect(component['getCost'](item)).toEqual(1200);

    item = { cost: 1200, monthlyCost: 0, sourceCode: FinancialSourceType.paid };
    expect(component['getCost'](item)).toEqual(1200);

    item = { cost: 0, monthlyCost: 0, sourceCode: FinancialSourceType.budget };
    expect(component['getCost'](item)).toEqual(0);

    item = { cost: 800, monthlyCost: 0, sourceCode: FinancialSourceType.private };
    expect(component['getCost'](item)).toEqual(800);

    item = { cost: 0, monthlyCost: 0, sourceCode: FinancialSourceType.none };
    expect(component['getCost'](item)).toEqual(0);
  });
});
