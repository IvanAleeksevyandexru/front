import { cloneDeep } from 'lodash';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { ScenarioDto } from '@epgu/epgu-constructor-types';
import {
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  ConfigService,
  ConfigServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  ModalService,
  ModalServiceStub,
  ConstructorLookupModule,
  Icons,
  mockSelectMapObjectStore,
  IGeoCoordsResponse,
  AddressesToolsService,
} from '@epgu/epgu-constructor-ui-kit';

import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { UtilsService } from '@epgu/epgu-constructor-ui-kit';
import { UtilsServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { BaseModule } from '../../../../shared/base.module';
import { PrevButtonModule } from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../../custom-screen/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { SelectMapObjectComponent } from './select-map-object.component';
import { mockMapDictionary } from './mocks/mock-select-map-dictionary';
import {
  DictionaryResponse,
} from '../../../../shared/services/dictionary/dictionary-api.types';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { PrepareComponentsService } from '../../../../shared/services/prepare-components/prepare-components.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { ActionService } from '../../../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../../../shared/directives/action/action.service.stub';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { MockModule } from 'ng-mocks';

describe('SelectMapObjectComponent', () => {
  let component: SelectMapObjectComponent;
  let fixture: ComponentFixture<SelectMapObjectComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;
  let MapStore: ScenarioDto;
  let comp;
  let compValue;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMapObjectComponent],
      imports: [BaseModule, ConstructorLookupModule, MockModule(PrevButtonModule)],
      providers: [
        Icons,
        ModalErrorService,
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        HtmlRemoverService,
        CurrentAnswersService,
        AutocompleteApiService,
        RefRelationService,
        PrepareComponentsService,
        CachedAnswersService,
        ScreenService,
        DateRestrictionsService,
        AddressesToolsService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        CurrentAnswersService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    dictionaryApiService = TestBed.inject(DictionaryApiService);
    fixture = TestBed.createComponent(SelectMapObjectComponent);
    component = fixture.componentInstance;
    MapStore = cloneDeep(mockSelectMapObjectStore);
    comp = MapStore.display.components[0];
    compValue = JSON.parse(comp.value);
    screenService.initScreenStore(MapStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fillCoords()', (done) => {
    jest
      .spyOn(component['addressesToolsService'], 'getCoordsByAddress')
      .mockImplementation((items) => {
        return of({
          coords: items.map(() => ({
            address: 'Российская Федерация, г. Москва, ул. Ялтинская',
            latitude: 55.649489,
            longitude: 37.61017,
          })),
          error: null,
        });
      });
    jest
      .spyOn(dictionaryApiService, 'getSelectMapDictionary')
      .mockReturnValue(of((mockMapDictionary as unknown) as DictionaryResponse));
    component['fillCoords'](comp.attrs.dictionaryFilter).subscribe((coords: IGeoCoordsResponse) => {
      expect(coords.coords.length).toBe(122);
      expect(coords.coords[0]).toEqual({
        address: 'Российская Федерация, г. Москва, ул. Ялтинская',
        latitude: 55.649489,
        longitude: 37.61017,
      });
      done();
    });
  });

  it('isFiltersSame() should return true', () => {
    const isFiltersSame = component['isFiltersSame']();
    expect(isFiltersSame).toBeTruthy();
  });

  it('isFiltersSame() should return false', () => {
    component['componentPresetValue'].regCode = 'R66';
    const isFiltersSame = component['isFiltersSame']();
    expect(isFiltersSame).toBeFalsy();
  });
});
