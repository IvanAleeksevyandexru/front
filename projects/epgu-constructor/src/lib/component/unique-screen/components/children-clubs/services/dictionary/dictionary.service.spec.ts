import { TestBed } from '@angular/core/testing';
import {
  CfAppStateService,
  CfAppStateServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  LocationService,
  LocationServiceStub,
  MicroAppStateQuery,
  MicroAppStateService,
  MicroAppStateStore,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../state/state.service';
import { DictionaryCcService } from './dictionary.service';
import { municipalityStub, programStub } from '../../stubs/projects.stub';
import { FocusDirectionsItem } from '../../models/children-clubs.types';
import { DictionaryApiServiceStub } from '../../../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryApiService } from '../../../../../../shared/services/dictionary/dictionary-api.service';
import { ApiService } from '@epgu/children-clubs/src/lib/services/api/api.service';
import { ApiServiceStub } from '@epgu/children-clubs/src/lib/services/api/api.service.stub';

describe('DictionaryService', () => {
  let service: DictionaryCcService;
  let state: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DictionaryCcService,
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: CfAppStateService, useClass: CfAppStateServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    }).compileComponents();
    service = TestBed.inject(DictionaryCcService);
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
      expect(focus[0]).toEqual({ id: 'empty-item', text: 'Все' });
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
      expect(directions['2'][0]).toEqual({ id: 'empty-item', text: 'Все' });
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
