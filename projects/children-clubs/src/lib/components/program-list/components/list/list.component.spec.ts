import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
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

import { ListComponent } from './list.component';
import { ItemComponent } from '../item/item.component';
import { ProgramListService } from '../../../../services/program-list/program-list.service';
import { ApiService } from '../../../../services/api/api.service';
import { ApiServiceStub } from '../../../../services/api/api.service.stub';
import { StateService } from '../../../../services/state/state.service';
import { StateServiceStub } from '../../../../services/state/state.service.stub';
import { MockModule } from 'ng-mocks';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let listService: ProgramListService;

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent, ItemComponent],
      providers: [
        ProgramListService,
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
      ],
      imports: [BaseUiModule, LongButtonModule, MockModule(CoreUiModule), ScreenPadModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    listService = TestBed.inject(ProgramListService);
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
      listService.autoScroll$$.next(true);
      listService.isFinish$$.next(false);
      listService.fullLoading$$.next(false);
      listService.loading$$.next(false);
      component.loadPercentScroll = 99;
    });

    it('should call event emitter', () => {
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return if no autoscroll', () => {
      listService.autoScroll$$.next(false);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if isFinish', () => {
      listService.isFinish$$.next(true);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if fullLoading', () => {
      listService.isFinish$$.next(true);
      const spy = jest.spyOn(component.addItemsEvent, 'emit');

      component.handleScroll(element);

      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should return if Loading', () => {
      listService.isFinish$$.next(true);
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
      listService.autoScroll$$.next(false);

      component.next();

      expect(listService.autoScroll).toBeTruthy();
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
