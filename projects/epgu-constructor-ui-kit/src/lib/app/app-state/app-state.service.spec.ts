import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AppStateService } from './app-state.service';
import { AppStateStore } from './app-state.store';

describe('AppStateService', () => {
  let service: AppStateService<unknown, unknown>;
  let store: AppStateStore<unknown, unknown>;
  let spyStoreUpdate;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      providers: [
        AppStateService,
        AppStateStore,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AppStateService);
    store = TestBed.inject(AppStateStore);
    spyStoreUpdate = jest.spyOn(store, 'update');
  });

  describe('initialize()', () => {
    let initState;

    beforeEach(() => {
      initState = { value: {}, state: {}};
    });

    it('should call store update', () => {
      service.initialize(initState);
      expect(store.update).toBeCalled();
    });

    it('should equal storeState', () => {
      const prevStoreState = store.getValue();
      service.initialize(initState);
      expect(store.getValue()).toEqual({ ...prevStoreState, ...initState });
    });
  });

  describe('updateValue()', () => {
    let newValue;

    beforeEach(() => {
      newValue = { key1: 'some value 1' };
    });

    it('should call store update', () => {
      service.updateValue(newValue);
      expect(store.update).toBeCalled();
    });

    it('should equal storeState', () => {
      const prevStoreState = store.getValue();
      service.updateValue(newValue);
      expect(store.getValue()).toEqual({ ...prevStoreState, value: newValue });
    });
  });

  describe('updateState()', () => {
    let newState;

    beforeEach(() => {
      newState = { key1: 'some state value 1' };
    });

    it('should call store update', () => {
      service.updateState(newState);
      expect(store.update).toBeCalled();
    });

    it('should equal storeState', () => {
      const prevStoreState = store.getValue();
      service.updateState(newState);
      expect(store.getValue()).toEqual({ ...prevStoreState, state: newState });
    });
  });

  describe('updateCurrentComponent()', () => {
    let newComponent;

    beforeEach(() => {
      newComponent = 'test1';
    });

    it('should call store update', () => {
      service.updateCurrentComponent(newComponent);
      expect(store.update).toBeCalled();
    });

    it('should equal storeState', () => {
      const prevStoreState = store.getValue();
      service.updateCurrentComponent(newComponent);
      expect(store.getValue()).toEqual({ ...prevStoreState, currentComponent: newComponent });
    });
  });
});
