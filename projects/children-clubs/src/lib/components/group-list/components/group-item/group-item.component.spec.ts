import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AppNavigationService,
  AppNavigationServiceStub,
  AppStateQuery,
  AppStateQueryStub,
  AppStateService,
  AppStateServiceStub,
  ConfigService,
  ConfigServiceStub,
  ImgPrefixerModule,
  SafeModule,
} from '@epgu/epgu-constructor-ui-kit';
import { EpguLibModule } from '@epgu/epgu-lib';
import { FinancialSourceType } from '../../../../typings';
import { GroupItemComponent } from './group-item.component';

describe('GroupItemComponent', () => {
  let component: GroupItemComponent;
  let fixture: ComponentFixture<GroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EpguLibModule,
        ImgPrefixerModule,
        SafeModule,
      ],
      declarations: [GroupItemComponent],

      providers: [
        { provide: AppStateService, useClass: AppStateServiceStub },
        { provide: AppStateQuery, useClass: AppStateQueryStub },
        { provide: AppNavigationService, useClass: AppNavigationServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupItemComponent);
    component = fixture.componentInstance;
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
});
