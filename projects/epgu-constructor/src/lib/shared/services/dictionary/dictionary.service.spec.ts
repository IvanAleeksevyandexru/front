import { TestBed } from '@angular/core/testing';
import {
  MicroAppStateQuery,
  MicroAppStateService,
  MicroAppStateStore,
} from '@epgu/epgu-constructor-ui-kit';
import { StateService } from '../../../component/unique-screen/components/children-clubs/services/state/state.service';
import {
  municipalityStub,
  programStub,
} from '../../../component/unique-screen/components/children-clubs/stubs/projects.stub';
import { DictionaryApiService } from './dictionary-api.service';
import { DictionaryApiServiceStub } from './dictionary-api.service.stub';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let state: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DictionaryService,
        StateService,
        MicroAppStateService,
        MicroAppStateQuery,
        MicroAppStateStore,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
      ],
    }).compileComponents();
    service = TestBed.inject(DictionaryService);
    state = TestBed.inject(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
