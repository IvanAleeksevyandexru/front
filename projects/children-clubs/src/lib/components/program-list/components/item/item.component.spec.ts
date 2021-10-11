import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  CoreUiModule,
  LongButtonModule,
  ScreenPadModule,
  ConfigService,
  ConfigServiceStub,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  MicroAppStateStore,
  MicroAppStateQuery,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../../../../services/state/state.service';
import { MockModule } from 'ng-mocks';
import { ProgramListModule } from '../../program-list.module';
import { ItemComponent } from './item.component';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { baseProgramStub } from '../../../../stubs/projects.stub';

describe('ViewComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        StateService,
        MicroAppStateStore,
        MicroAppStateStore,
        MicroAppStateQuery,
        DictionaryService,
      ],
      imports: [LongButtonModule, MockModule(CoreUiModule), ScreenPadModule, ProgramListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('show()', () => {
    it('should call service methods', () => {
      component.data = baseProgramStub;
      const spy = jest.spyOn(component['appNavigationService'], 'next');

      component.show();

      expect(component['stateService'].selectedProgramUUID).toBe(baseProgramStub.uuid);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
