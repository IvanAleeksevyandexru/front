import { catchError, filter, map, reduce, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DeviceDetectorService, YMapItem } from '@epgu/epgu-constructor-ui-kit';

import { merge, Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { SelectMapObjectComponent } from './select-map-object.component';
import { ProgramListService } from '../children-clubs/services/program-list/program-list.service';
import { StateService } from '../children-clubs/services/state/state.service';
import { BaseProgram } from '../children-clubs/models/children-clubs.types';
import { IFillCoordsResponse } from './select-map-object.service';
import { DictionaryYMapItem } from '../../../../shared/services/dictionary/dictionary-api.types';
import { PaymentInfoInterface } from '../payment/payment.types';

@Component({
  selector: 'epgu-constructor-cc-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default, // @todo. заменить на OnPush
})
export class ChildrenClubsSelectMapObjectComponent extends SelectMapObjectComponent {
  constructor(
    public deviceDetector: DeviceDetectorService,
    public injector: Injector,
    private programListService: ProgramListService,
    private stateService: StateService,
  ) {
    super(injector);
  }

  public selectObject(item: YMapItem<{ uuid?: string }>): void {
    const { uuid } = item;
    this.stateService.selectedProgramUUID = uuid;
    this.programListService.selectProgram(uuid);
  }

  protected initMap(): void {
    this.fillCoords()
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        catchError((error) => this.handleError(error)),
        filter((coords: IFillCoordsResponse) => !!coords.coords),
        tap((coords: IFillCoordsResponse) => this.handleGettingCoordinatesResponse(coords)),
      )
      .subscribe(() => {
        this.screenService.isLoaderVisible.next(false);
      });
  }

  protected fillCoords(): Observable<IFillCoordsResponse> {
    return this.programListService.fullData$.pipe(
      switchMap((programList: BaseProgram[]) => {
        // Параллелим получение геоточек на 4 запроса
        const addresses = programList.map((program) => program.address);
        const chunkSize = addresses.length / 4;
        this.selectMapObjectService.dictionary = {
          items: this.programToDictionaryItemAdapter(programList),
          total: programList.length,
        };
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
            return {
              coords,
              dictionaryError: null,
            };
          }),
        );
      }),
    );
  }

  protected initSelectedValue(): void {
    const { addressString, selectedProgramUUID } = this.stateService;
    if (selectedProgramUUID) {
      const selectedClub = this.yandexMapService.objectManager.objects
        .getAll()
        .find((club) => club.properties.res.uuid === this.stateService.selectedProgramUUID);
      this.yandexMapService.markPointAsActive(selectedClub);
      this.yandexMapService.setCenter(selectedClub.geometry.coordinates);
      this.hasPreviouslyChoosen = this.selectMapObjectService.dictionary.items.find(
        (item) => item.uuid === selectedProgramUUID,
      );
    } else if (addressString) {
      this.yandexMapService.geoCode(addressString).subscribe((geoCode) => {
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

  private programToDictionaryItemAdapter(programs: BaseProgram[]): DictionaryYMapItem[] {
    return programs.map((program, idx) => {
      return {
        ...program,
        title: program.name,
        baloonContent: [],
        idForMap: idx,
        objectId: idx,
        agreement: false,
        expanded: false,
        attributeValues: ({
          address: program.address,
        } as unknown) as PaymentInfoInterface & { [key: string]: string & number },
        hidden: false,
        isLeaf: false,
        children: [],
        parentValue: null,
        attributes: [],
        text: '',
        value: idx.toString(),
        id: idx.toString(),
        center: [0, 0],
      };
    });
  }
}
