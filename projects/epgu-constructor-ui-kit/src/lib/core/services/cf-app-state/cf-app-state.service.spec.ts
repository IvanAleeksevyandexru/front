import { TestBed } from '@angular/core/testing';
import { CfAppStateService } from './cf-app-state.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../local-storage/local-storage.service.stub';
import {
  APP_INPUT_KEY,
  APP_OUTPUT_KEY,
  DataDirectionType,
  InputAppDto,
  OutputAppDto,
} from '@epgu/epgu-constructor-types';

describe('CfAppStateService', () => {
  let service: CfAppStateService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CfAppStateService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(CfAppStateService);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  describe('setState()', () => {
    let spy;
    beforeEach(() => {
      spy = jest.spyOn(localStorageService, 'set');
    });

    afterEach(() => {
      localStorage.removeItem(APP_INPUT_KEY);
      localStorage.removeItem(APP_OUTPUT_KEY);
    });

    it('should call set of localStorageService with APP_INPUT_KEY', () => {
      const state: InputAppDto = {
        isPrevStepCase: false,
        callbackRedirectUrl: '/some/url',
        value: '{}',
        componentType: 'ChildrenClubs',
        componentId: 'app1',
      };
      const key = DataDirectionType.INPUT;
      service.setState(state, key);
      expect(spy).toBeCalledWith(APP_INPUT_KEY, state);
    });

    it('should call set of localStorageService with APP_OUTPUT_KEY', () => {
      const state: OutputAppDto = {
        isPrevStepCase: false,
        value: '{}',
        componentType: 'ChildrenClubs',
        componentId: 'app1',
      };
      const key = DataDirectionType.OUTPUT;
      service.setState(state, key);
      expect(spy).toBeCalledWith(APP_OUTPUT_KEY, state);
    });
  });

  describe('getState()', () => {
    let spy;
    beforeEach(() => {
      spy = jest.spyOn(localStorageService, 'get');
      localStorage.setItem(APP_INPUT_KEY, '{}');
      localStorage.setItem(APP_OUTPUT_KEY, '{}');
    });

    afterEach(() => {
      localStorage.removeItem(APP_INPUT_KEY);
      localStorage.removeItem(APP_OUTPUT_KEY);
    });

    it('should call get of localStorageService with APP_INPUT_KEY', () => {
      const key = DataDirectionType.INPUT;
      service.getState(key);
      expect(spy).toBeCalledWith(APP_INPUT_KEY);
    });

    it('should call get of localStorageService with APP_OUTPUT_KEY', () => {
      const key = DataDirectionType.OUTPUT;
      service.getState(key);
      expect(spy).toBeCalledWith(APP_OUTPUT_KEY);
    });
  });
});
