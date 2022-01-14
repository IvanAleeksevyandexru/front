import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CoreUiModule,
  LongButtonModule,
  ScreenPadModule,
  ConfigService,
  ConfigServiceStub,
  ModalServiceStub,
  ModalService,
  MicroAppStateStore,
} from '@epgu/epgu-constructor-ui-kit';
import { MockModule } from 'ng-mocks';
import { ViewComponent } from './view.component';
import { StateService } from '../../../../services/state/state.service';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { ProgramListModule } from '../../program-list.module';
import { ActionService } from '../../../../../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../../../../../shared/directives/action/action.service.stub';
import { ScreenService } from '../../../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../../../screen/screen.service.stub';
import {
  NEXT_STEP_ACTION,
  PREV_STEP_ACTION,
} from '../../../../../../../../shared/constants/actions';
import { VendorType } from '../../../../models/children-clubs.types';
import { ComponentDto } from '@epgu/epgu-constructor-types';
import { DictionaryService } from '../../../../../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary.service.stub';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;
  let actionService: ActionService;
  let dictionaryService: DictionaryService;
  let screenService: ScreenService;
  const mockComponent: ComponentDto = {
    arguments: { vendor: VendorType.inlearno, program: '123', nextSchoolYear: 'false' },
    attrs: {},
    label: '',
    type: '',
    id: '12',
    value: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        MicroAppStateStore,
      ],
      imports: [LongButtonModule, MockModule(CoreUiModule), ScreenPadModule, ProgramListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    actionService = TestBed.inject(ActionService);
    dictionaryService = TestBed.inject(DictionaryService);
    screenService = TestBed.inject(ScreenService);
    screenService.component = mockComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call service methods', () => {
      const spy = jest.spyOn(dictionaryService, 'getProgram');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledWith('123', false);
    });
  });

  describe('next()', () => {
    it('should call service methods', () => {
      const spy = jest.spyOn(actionService, 'switchAction');

      component.next();

      expect(spy).toHaveBeenCalledWith(NEXT_STEP_ACTION);
    });
  });

  describe('prev()', () => {
    it('should call service methods', () => {
      const spy = jest.spyOn(actionService, 'switchAction');

      component.prev();

      expect(spy).toHaveBeenCalledWith(PREV_STEP_ACTION);
    });
  });
});
