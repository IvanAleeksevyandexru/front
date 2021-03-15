import { cloneDeep } from 'lodash';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteApiService } from '../../../../core/services/autocomplete/autocomplete-api.service';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { DeviceDetectorService } from '../../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../../core/services/device-detector/device-detector.service.stub';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { LocalStorageService } from '../../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../../core/services/local-storage/local-storage.service.stub';
import { NavigationModalService } from '../../../../core/services/navigation-modal/navigation-modal.service';
import { NavigationModalServiceStub } from '../../../../core/services/navigation-modal/navigation-modal.service.stub';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../../../core/services/navigation/navigation.service.stub';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { UtilsServiceStub } from '../../../../core/services/utils/utils.service.stub';
import { FormPlayerApiService } from '../../../../form-player/services/form-player-api/form-player-api.service';
import { FormPlayerApiServiceStub } from '../../../../form-player/services/form-player-api/form-player-api.service.stub';
import { ScenarioDto } from '../../../../form-player/services/form-player-api/form-player-api.types';
import { ModalErrorService } from '../../../../modal/modal-error.service';
import { ModalService } from '../../../../modal/modal.service';
import { ModalServiceStub } from '../../../../modal/modal.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { BaseModule } from '../../../../shared/base.module';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { NavigationModule } from '../../../../shared/components/navigation/navigation.module';
import { ComponentsListRelationsService } from '../../../../shared/services/components-list-relations/components-list-relations.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { HtmlRemoverService } from '../../../../shared/services/html-remover/html-remover.service';
import { Icons } from './constants';
import { mockSelectMapObjectData, mockSelectMapObjectStore } from './mocks/mock-select-map-object';
import { SelectMapObjectComponent } from './select-map-object.component';
import { IGeoCoordsResponse } from './select-map-object.interface';
import { Observable, of } from 'rxjs';
import { mockMapDictionary } from './mocks/mock-select-map-dictionary';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../shared/services/dictionary/dictionary-api.types';

describe('SelectMapObjectComponent', () => {
  let component: SelectMapObjectComponent;
  let fixture: ComponentFixture<SelectMapObjectComponent>;
  let screenService: ScreenService;
  let dictionaryApiService: DictionaryApiService;
  let MapStore: ScenarioDto;
  let comp;
  let compValue;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectMapObjectComponent],
      imports: [BaseModule, ConstructorLookupModule, NavigationModule],
      providers: [
        Icons,
        ModalErrorService,
        EventBusService,
        DictionaryToolsService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        HtmlRemoverService,
        CurrentAnswersService,
        AutocompleteApiService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: FormPlayerApiService, useClass: FormPlayerApiServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: NavigationModalService, useClass: NavigationModalServiceStub },
        { provide: UtilsService, useClass: UtilsServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    })
      .compileComponents()
      .then(() => {
        screenService = TestBed.inject(ScreenService);
        dictionaryApiService = TestBed.inject(DictionaryApiService);
        fixture = TestBed.createComponent(SelectMapObjectComponent);
        component = fixture.componentInstance;
        MapStore = cloneDeep(mockSelectMapObjectStore);
        comp = MapStore.display.components[0];
        compValue = JSON.parse(comp.value);
        screenService.initScreenStore(mockSelectMapObjectStore);
        fixture.detectChanges();
      });
  });

   it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fillCoords()', (done) => {
    jest
      .spyOn(component.selectMapObjectService, 'getCoordsByAddress')
      .mockImplementation((items: DictionaryItem[]) => {
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
});
