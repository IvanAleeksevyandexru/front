import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import {
  MicroAppStateQuery,
  MicroAppStateService,
  MicroAppStateStore,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../state/state.service';
import { ApiService } from '../api/api.service';
import { ApiServiceStub } from '../api/api.service.stub';
import { DictionaryService } from './dictionary.service';
import { FocusDirectionsItem } from '../../typings';
import { municipalityStub, programStub } from '../../stubs/projects.stub';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let state: StateService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        DictionaryService,
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        { provide: ApiService, useClass: ApiServiceStub },
      ],
    });
    service = TestBed.inject(DictionaryService);
    state = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('normalizeFocusData()', () => {
    it('should unshift specific item to focus array if array is not empty', () => {
      const focusData: FocusDirectionsItem[] = [
        { directions: ['top'], focusCode: '2', focusName: '3' },
      ];

      const { focus } = service.normalizeFocusData(focusData);
      expect(focus.length).toBe(2);
      expect(focus[0]).toEqual({ id: null, text: 'Все' });
    });

    it('should not unshift specific item to focus array if array is empty', () => {
      const focusData: FocusDirectionsItem[] = [];

      const { focus } = service.normalizeFocusData(focusData);

      expect(focus.length).toBe(0);
    });

    it('should unshift specific item to directions array if array is not empty', () => {
      const focusData: FocusDirectionsItem[] = [
        { directions: ['top'], focusCode: '2', focusName: '3' },
      ];

      const { directions } = service.normalizeFocusData(focusData);

      expect(directions['2'].length).toBe(2);
      expect(directions['2'][0]).toEqual({ id: null, text: 'Все' });
    });

    it('should unshift specific item to directions array if array is not empty', () => {
      const focusData: FocusDirectionsItem[] = [{ directions: [], focusCode: '2', focusName: '3' }];

      const { directions } = service.normalizeFocusData(focusData);

      expect(directions['2'].length).toBe(0);
    });
  });

  it('should get data from api on subscribe to municipalities', (done) => {
    state.changeState({ okato: '1' });

    service.municipalitiesList$.subscribe((value) => {
      expect(value.length).toBe(municipalityStub.length);
      done();
    });
  });

  it('should get data from api on subscribe to program', (done) => {
    state.changeState({ selectedProgramUUID: '1' });

    service.program$.subscribe((value) => {
      expect(value).toBe(programStub);
      done();
    });
  });

  it('should get data from api on subscribe to focusData', (done) => {
    state.changeState({ okato: '1' });

    service.focusData$.subscribe((value) => {
      expect(value.hasOwnProperty('directions')).toBe(true);
      expect(value.hasOwnProperty('focus')).toBe(true);
      done();
    });
  });
});
