import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AddressesToolsService,
  MicroAppNavigationService,
  ConfigService,
  DeviceDetectorService,
  IYMapPoint,
  ModalService,
  UnsubscribeService,
  YandexMapService,
  YMapItem,
} from '@epgu/epgu-constructor-ui-kit';
import { YaMapService } from '@epgu/ui/services/ya-map';
import { catchError, filter, map, reduce, switchMap, takeUntil, tap } from 'rxjs/operators';
import { merge, Observable } from 'rxjs';
import { BaseProgram, financingTypes } from '../../typings';
import { StateService } from '../../services/state/state.service';
import { ProgramListService } from '../../services/program-list/program-list.service';
import { ContentModalComponent } from '../base/components/content-modal/content-modal.component';

@Component({
  selector: 'children-clubs-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, YandexMapService],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedValue;
  public showMap = false;
  public scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  public isMobile: boolean;
  public financingTypes = financingTypes;

  constructor(
    public yandexMapService: YandexMapService,
    public config: ConfigService,
    private yaMapService: YaMapService,
    private ngUnsubscribe$: UnsubscribeService,
    private cdr: ChangeDetectorRef,
    private deviceDetector: DeviceDetectorService,
    private programListService: ProgramListService,
    private appNavigationService: MicroAppNavigationService,
    private stateService: StateService,
    private zone: NgZone,
    private modalService: ModalService,
    private addressesToolsService: AddressesToolsService,
  ) {
    this.isMobile = this.deviceDetector.isMobile;
  }

  ngOnInit(): void {
    this.programListService.load$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    this.initVariable();
    this.subscribeToEmmitNextStepData();
    this.stateService.isLoaderVisible = true;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showMap = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.clearMapVariables();
  }

  public selectObject(item: YMapItem<BaseProgram>): void {
    // Если вызывать напрямую, то cdr перестает перерисовывать приложение
    // Если вынести вызов за perfect-scrollbar в шаблоне то работает нормально
    this.zone.run(() => {
      this.stateService.selectedProgramUUID = item.uuid;
      this.appNavigationService.next();
    });
  }

  /**
   * Метод раскрывает выбранный зал на панели слева
   * @param mapObject объект на карте
   */
  public expandObject(mapObject: YMapItem<BaseProgram>): void {
    if (!mapObject || mapObject.expanded) return;
    this.yandexMapService.selectedValue$.next(
      this.yandexMapService.selectedValue$.value.map((object: YMapItem<BaseProgram>) => {
        return { ...object, expanded: object === mapObject };
      }),
    );
    this.cdr.markForCheck();
  }

  public handleError(error: string): Observable<unknown> {
    return this.openModal('Ошибка', error);
  }

  private initVariable(): void {
    this.controlsLogicInit();
  }

  private subscribeToEmmitNextStepData(): void {
    this.yandexMapService.selectedValue$.subscribe(() => {
      setTimeout(() => this.cdr.detectChanges(), 0);
    });
  }

  private controlsLogicInit(): void {
    this.yaMapService.mapSubject
      .pipe(
        filter((yMap) => yMap),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.initMap();
      });
  }

  /**
   * Инициализация карты - попытка определения центра, получение и расстановка точек на карте
   */
  private initMap(): void {
    this.fillCoords()
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((error) => this.handleError(error)),
        filter((coords: IYMapPoint<BaseProgram>[]) => !!coords),
        tap((coords: IYMapPoint<BaseProgram>[]) => this.handleGettingCoordinatesResponse(coords)),
      )
      .subscribe(() => this.yandexMapService.centerAllPoints());
  }

  private openModal(title: string, text: string): Observable<unknown> {
    return this.modalService.openModal(ContentModalComponent, {
      title,
      text,
      modalId: 'modalError',
    });
  }

  private handleGettingCoordinatesResponse(coords: IYMapPoint<BaseProgram>[]): void {
    this.stateService.isLoaderVisible = false;
    this.yandexMapService.placeObjectsOnMap<BaseProgram>(coords);
    setTimeout(() => this.cdr.detectChanges(), 0);
  }

  private fillCoords(): Observable<IYMapPoint<BaseProgram>[]> {
    return this.programListService.data$.pipe(
      switchMap((programList: BaseProgram[]) => {
        // Параллелим получение геоточек на 4 запроса
        const addresses = programList.map((program) => program.address);
        const chunkSize = addresses.length / 4;
        return merge(
          this.addressesToolsService.getCoordsByAddress(addresses.splice(0, chunkSize)),
          this.addressesToolsService.getCoordsByAddress(addresses.splice(0, chunkSize)),
          this.addressesToolsService.getCoordsByAddress(addresses.splice(0, chunkSize)),
          this.addressesToolsService.getCoordsByAddress(addresses),
        ).pipe(
          reduce((acc, { coords }) => {
            return [...acc, ...coords];
          }, []),
          map((coords) => {
            const addressMap = {};
            coords.forEach((coord) => {
              addressMap[coord.address] = [coord.longitude, coord.latitude];
            });
            const mapItems = programList.map((program) => {
              return {
                center: addressMap[program.address],
                obj: program,
              };
            });
            return mapItems;
          }),
        );
      }),
    );
  }

  private clearMapVariables(): void {
    // Необходимо очистить behaviorSubject чтобы при следующей подписке он не стрельнул 2 раза (текущее значение и новое при создание карты)
    this.yaMapService.mapSubject.next(null);
  }
}
