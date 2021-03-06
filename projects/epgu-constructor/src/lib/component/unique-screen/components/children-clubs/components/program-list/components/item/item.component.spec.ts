import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { MockModule } from 'ng-mocks';
import { StateService } from '../../../../services/state/state.service';
import { ProgramListModule } from '../../program-list.module';
import { ItemComponent } from './item.component';
import { baseProgramStub } from '../../../../stubs/projects.stub';
import { ProgramListService } from '../../../../services/program-list/program-list.service';
import { ProgramListServiceStub } from '../../../../services/program-list/program-list.stub';
import { DictionaryService } from '../../../../../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary.service.stub';

describe('ViewComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let programListService: ProgramListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: ProgramListService, useClass: ProgramListServiceStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        StateService,
        MicroAppStateStore,
        MicroAppStateStore,
        MicroAppStateQuery,
      ],
      imports: [LongButtonModule, MockModule(CoreUiModule), ScreenPadModule, ProgramListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;
    programListService = TestBed.inject(ProgramListService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('show()', () => {
    it('should call service methods', () => {
      component.data = baseProgramStub;
      const spy = jest.spyOn(programListService, 'selectProgram');

      component.show();

      expect(spy).toHaveBeenCalledWith(baseProgramStub.uuid);
    });
  });
});
