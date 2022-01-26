import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  CoreUiModule,
  HealthServiceStub,
  LongButtonModule,
  ScreenPadModule,
  HealthService,
  BaseUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { MockModule } from 'ng-mocks';
import { ListComponent } from './list.component';
import { ItemComponent } from '../item/item.component';
import { ProgramListService } from '../../../../services/program-list/program-list.service';
import { StateService } from '../../../../services/state/state.service';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { ProgramListServiceStub } from '../../../../services/program-list/program-list.stub';
import { DictionaryApiService } from '../../../../../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../../../../../shared/services/dictionary/dictionary-api.service.stub';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let programListService: ProgramListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent, ItemComponent],
      providers: [
        { provide: ProgramListService, useClass: ProgramListServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
      ],
      imports: [BaseUiModule, LongButtonModule, MockModule(CoreUiModule), ScreenPadModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    programListService = TestBed.inject(ProgramListService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleScroll()', () => {
    let element;
    beforeEach(() => {
      element = {};
      element.clientHeight = 100;
      element.scrollHeight = 99;
      element.scrollTop = 10;
      element.offsetHeight = 20;
      element.scrollHeight = 30;
      programListService.autoScroll$$.next(true);
      programListService.isFinished.next(false);
      programListService.isLoading.next(false);
      component.loadPercentScroll = 99;
    });

    it('should call event emitter', () => {
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return if no autoscroll', () => {
      programListService.autoScroll$$.next(false);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if isFinish', () => {
      programListService.isFinished.next(true);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if fullLoading', () => {
      programListService.isFinished.next(true);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if Loading', () => {
      programListService.isFinished.next(true);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return scrollHeight equal to client height', () => {
      element.scrollHeight = 100;
      element.clientHeight = 100;
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if loadPercentScroll is greater than getScrollPosition', () => {
      element.scrollTop = 10;
      element.offsetHeight = 20;
      element.scrollHeight = 30;
      component.loadPercentScroll = 101;
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('next()', () => {
    it('should set autoscroll to true', () => {
      programListService.autoScroll$$.next(false);

      component.next();

      expect(programListService.autoScroll).toBeTruthy();
    });

    it('should call event emitter', () => {
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.next();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getScrollPosition()', () => {
    it('should correctly calculate position', () => {
      const element = { scrollTop: 50, offsetHeight: 50, scrollHeight: 100 };

      const res = component.getScrollPosition(element as HTMLElement);

      expect(res).toBe(100);
    });
  });
});
