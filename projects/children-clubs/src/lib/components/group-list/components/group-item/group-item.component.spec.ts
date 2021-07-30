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
} from '@epgu/epgu-constructor-ui-kit';
import { EpguLibModule } from '@epgu/epgu-lib';
import { DenyReason, FinancialSourceType, Group } from '../../../../typings';
import { GroupItemComponent } from './group-item.component';
import { DenyReasonTitleComponent } from '../../../base/components/deny-reason-title/deny-reason-title.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';

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
        text:
          '<h6 class=\"deny-reason-text\">test text ${orderTo}</h6>',
      },
    },
  }),
};

describe('GroupItemComponent', () => {
  let component: GroupItemComponent;
  let fixture: ComponentFixture<GroupItemComponent>;
  let stateQuery: MicroAppStateQueryStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpguLibModule, ImgPrefixerModule, SafeModule],
      declarations: [GroupItemComponent, DenyReasonTitleComponent],

      providers: [
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        DatesToolsService,
      ],
    }).overrideComponent(GroupItemComponent,{
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupItemComponent);
    component = fixture.componentInstance;
    component.group = testGroup;
    stateQuery = TestBed.inject(MicroAppStateQuery);
    jest.spyOn(stateQuery, 'state', 'get').mockReturnValue(testState);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should be deny reason message', () => {
    expect(component.denyReasonMessage).toBeTruthy();
  });

  it('should be deny reason title', () => {
    const selector = 'children-clubs-deny-reason-title';

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl.nativeElement.textContent).toBe('test title 23.02.2020');
  });

  it('should be deny reason text', () => {
    const selector = '.group-item__deny-reason-text';

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl.nativeElement.textContent).toBe('test text 24.02.2020');
  });
});
