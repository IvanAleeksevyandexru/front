import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AddressesToolsService,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  MicroAppStateQuery,
  MicroAppStateQueryStub,
  MicroAppStateService,
  MicroAppStateServiceStub,
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  Icons,
  ModalService,
  ModalServiceStub,
  YMapItem,
  YandexMapService,
} from '@epgu/epgu-constructor-ui-kit';
import { configureTestSuite } from 'ng-bullet';
import { ApiService } from '../../services/api/api.service';
import { ApiServiceStub } from '../../services/api/api.service.stub';
import { ProgramListService } from '../../services/program-list/program-list.service';
import { StateService } from '../../services/state/state.service';
import { StateServiceStub } from '../../services/state/state.service.stub';
import { SelectMapObjectComponent } from './select-map-object.component';
import { SelectMapObjectModule } from './select-map-object.module';
import { of } from 'rxjs';
import { BaseProgram } from '../../typings';
import { baseProgramStub } from '../../stubs/projects.stub';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { HttpClientModule } from '@angular/common/http';

describe('SelectMapObjectComponent', () => {
  let component: SelectMapObjectComponent;
  let fixture: ComponentFixture<SelectMapObjectComponent>;
  let yaMapService: YaMapService;
  let yandexMapService: YandexMapService;
  let programListService: ProgramListService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [SelectMapObjectModule, HttpClientModule],
      providers: [
        Icons,
        DatesToolsService,
        ProgramListService,
        AddressesToolsService,
        YandexMapService,
        YaMapService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: StateService, useClass: StateServiceStub },
        { provide: MicroAppStateService, useClass: MicroAppStateServiceStub },
        { provide: MicroAppStateQuery, useClass: MicroAppStateQueryStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMapObjectComponent);
    component = fixture.componentInstance;
    yaMapService = TestBed.inject(YaMapService);
    yandexMapService = fixture.debugElement.injector.get(YandexMapService);
    programListService = TestBed.inject(ProgramListService);
    yaMapService.map = {
      geoObjects: {
        getBounds: () => [1, 1],
        removeAll: () => ({}),
        add: () => ({}),
      },
      getZoom: () => 1,
      setBounds: () =>
        new Promise((resolve) => {
          resolve(1);
        }),
      zoomRange: {
        get: () =>
          new Promise((resolve) => {
            resolve(1);
          }),
      },
      setCenter: () => 1,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('fill coords should have been called on init', () => {
      const spy = jest.spyOn(component as any, 'fillCoords');
      component['yaMapService'].mapSubject.next(true);

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should process base program to specific coords object', (done) => {
      jest
        .spyOn(component['addressesToolsService'], 'getCoordsByAddress')
        .mockImplementation((items) => {
          return of({
            coords: items.map(() => ({
              address: '141080, Московская область, г. Королёв, проезд Макаренко, дом 4',
              latitude: 55.649489,
              longitude: 37.61017,
            })),
            error: null,
          });
        });

      programListService.data$$.next(([baseProgramStub] as unknown) as BaseProgram[]);
      component['fillCoords']().subscribe((coords: any) => {
        expect(coords[0].center[0]).toBe(37.61017);
        expect(coords[0].center[1]).toBe(55.649489);
        expect(coords[0].obj.name).toBe('Ритмика, основы танцевального искусства');
        done();
      });
    });
  });

  describe('expandObject()', () => {
    it('should return if no object passed', () => {
      const result = component.expandObject(null);
      expect(result).toBeUndefined();
    });

    it('should return if expanded object passed', () => {
      const result = component.expandObject(({ expanded: true } as unknown) as YMapItem<any>);
      expect(result).toBeUndefined();
    });

    it('should expand passed object in service', () => {
      const obj = { expanded: false };
      yandexMapService.selectedValue$.next([obj]);
      component.expandObject((obj as unknown) as YMapItem<any>);
      expect(yandexMapService.selectedValue$.value[0].expanded).toBeTruthy();
    });
  });

  describe('ngOnDestroy()', () => {
    it('should clear mapSubject value', () => {
      component.ngOnDestroy();

      expect(component['yaMapService'].mapSubject.getValue()).toBeNull();
    });
  });

  describe('handleError()', () => {
    it('should return modal observable', (done) => {
      const res = component.handleError('error');

      res.subscribe(() => {
        done();
      });
    });
  });
});
