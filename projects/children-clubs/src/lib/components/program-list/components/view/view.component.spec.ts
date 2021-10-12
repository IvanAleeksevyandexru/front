import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  MicroAppStateService,
  CoreUiModule,
  LongButtonModule,
  ScreenPadModule,
  ConfigService,
  ConfigServiceStub,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  ModalServiceStub,
  ModalService,
  MicroAppStateStore,
  MicroAppStateQuery,
} from '@epgu/epgu-constructor-ui-kit';
import { ViewComponent } from './view.component';
import { StateService } from '../../../../services/state/state.service';
import { MockModule } from 'ng-mocks';
import { DictionaryService } from '../../../../services/dictionary/dictionary.service';
import { ProgramListModule } from '../../program-list.module';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        MicroAppStateService,
        StateService,
        MicroAppStateStore,
        MicroAppStateQuery,
        DictionaryService,
      ],
      imports: [LongButtonModule, MockModule(CoreUiModule), ScreenPadModule, ProgramListModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call service methods if program is not selected', () => {
      const spy = jest.spyOn(component['appNavigationService'], 'prev');

      component.ngOnInit();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call service methods if program is selected', () => {
      const spy = jest.spyOn(component['appNavigationService'], 'prev');
      component['stateService'].changeState({ selectedProgramUUID: '22' });
      component.ngOnInit();

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('next()', () => {
    it('should call service methods', () => {
      const spy = jest.spyOn(component['stateService'], 'clearGroupFilters');
      const spy2 = jest.spyOn(component['appNavigationService'], 'next');

      component.next();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
  });

  describe('prev()', () => {
    it('should call service methods', () => {
      const spy = jest.spyOn(component['stateService'], 'clearGroupFilters');
      const spy2 = jest.spyOn(component['appNavigationService'], 'prev');

      component.prev();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
  });
});
