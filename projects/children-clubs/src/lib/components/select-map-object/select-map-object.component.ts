import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
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
import { ScreenService } from '@epgu/epgu-constructor/src/lib/screen/screen.service';

@Component({
  selector: 'children-clubs-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  providers: [UnsubscribeService, YandexMapService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMapObjectComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedValue;
  public showMap = false;
  public scrollConfig = { suppressScrollX: true, wheelPropagation: false };
  public isMobile: boolean;
  public financingTypes = financingTypes;
  public mapOptions;

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
    private elementRef: ElementRef,
    private screenService: ScreenService,
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
    window.requestAnimationFrame(() => {
      this.showMap = true;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.clearMapVariables();
  }

  public selectObject(item: YMapItem<BaseProgram>): void {
    // ???????? ???????????????? ????????????????, ???? cdr ?????????????????? ???????????????????????????? ????????????????????
    // ???????? ?????????????? ?????????? ???? perfect-scrollbar ?? ?????????????? ???? ???????????????? ??????????????????
    this.zone.run(() => {
      this.stateService.selectedProgramUUID = item.uuid;
      this.appNavigationService.next();
    });
  }

  /**
   * ?????????? ???????????????????? ?????????????????? ?????? ???? ???????????? ??????????
   * @param mapObject ???????????? ???? ??????????
   */
  public expandObject(mapObject: YMapItem<BaseProgram>): void {
    if (!mapObject || mapObject.expanded) return;
    const expandedClub = this.yandexMapService.selectedValue$.value.find((club) => club.expanded);
    if (expandedClub) {
      expandedClub.expanded = false;
    }
    // eslint-disable-next-line no-param-reassign
    mapObject.expanded = true;
    this.cdr.detectChanges();
  }

  public handleError(error: string): Observable<unknown> {
    return this.openModal('????????????', error);
  }

  private initVariable(): void {
    this.controlsLogicInit();
  }

  private subscribeToEmmitNextStepData(): void {
    this.yandexMapService.selectedValue$.subscribe(() => {
      window.requestAnimationFrame(() => this.cdr.detectChanges());
    });
  }

  private controlsLogicInit(): void {
    this.initMapOptions();
    this.yaMapService.mapSubject
      .pipe(
        filter((yMap) => yMap),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe(() => {
        this.initMap();
      });
  }

  private initMapOptions(): void {
    this.mapOptions = JSON.parse(this.stateService.mapOptions || '{}');
    Object.assign(this.yandexMapService.mapOptions || {}, this.mapOptions);
  }

  /**
   * ?????????????????????????? ?????????? - ?????????????? ?????????????????????? ????????????, ?????????????????? ?? ?????????????????????? ?????????? ???? ??????????
   */
  private initMap(): void {
    this.fillCoords()
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((error) => this.handleError(error)),
        filter((coords: IYMapPoint<BaseProgram>[]) => !!coords),
        tap((coords: IYMapPoint<BaseProgram>[]) => this.handleGettingCoordinatesResponse(coords)),
      )
      .subscribe((coords) => {
        window.requestAnimationFrame(() => this.cdr.detectChanges());

        if (coords.length) {
          this.initCenter();
        }
      });
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
  }

  private fillCoords(): Observable<IYMapPoint<BaseProgram>[]> {
    return this.programListService.data$.pipe(
      switchMap((programList: BaseProgram[]) => {
        // ???????????????????? ?????????????????? ???????????????? ???? 4 ??????????????
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
    // ???????????????????? ???????????????? behaviorSubject ?????????? ?????? ?????????????????? ???????????????? ???? ???? ?????????????????? 2 ???????? (?????????????? ???????????????? ?? ?????????? ?????? ???????????????? ??????????)
    this.yaMapService.mapSubject.next(null);
  }

  private initCenter(): void {
    const { addressString, selectedProgramUUID } = this.stateService;
    const address =
      addressString || (this.screenService.component.arguments?.addressString as string);
    if (selectedProgramUUID) {
      // ???????????? ?????????? ?????????????? ??????????????, ?????? ?????? ?????? ?????????????????? ?? ???????? ?????? ?????? ??????
      const selectedClub = this.yandexMapService.objectManager.objects
        .getAll()
        .find((club) => club.properties.res.uuid === this.stateService.selectedProgramUUID);
      selectedClub.properties.res.expanded = true;
      this.yandexMapService.setCenter(selectedClub.geometry.coordinates);
      this.yandexMapService.setZoom(99);
      const clusters = this.yandexMapService.objectManager.clusters.getAll();
      const selectedCluster = clusters.find((cluster) => {
        return cluster.features.find(
          (club) => club.properties.res.uuid === this.stateService.selectedProgramUUID,
        );
      });
      this.yandexMapService.centeredPlaceMark(selectedCluster);
      window.requestAnimationFrame(() => {
        const expandedNode = this.elementRef.nativeElement.querySelector('.map-object.expanded');
        expandedNode?.scrollIntoView();
      });
    } else if (address) {
      this.yandexMapService.geoCode(address).subscribe((geoCode) => {
        const envelope =
          geoCode.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope;
        const bound1 = envelope.lowerCorner.split(' ').map((coord) => +coord);
        const bound2 = envelope.upperCorner.split(' ').map((coord) => +coord);
        this.yandexMapService.setBounds([bound1, bound2]);
      });
    } else {
      this.yandexMapService.centerAllPoints();
    }
  }
}
