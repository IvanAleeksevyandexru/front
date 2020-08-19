import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { tap, switchMap, filter, takeWhile } from 'rxjs/operators';

// import { YaMapService } from 'epgu-lib/lib/services/ya-map/ya-map.service';
import { YaMapService } from 'epgu-lib';
import { Subject, interval } from 'rxjs';
import { SelectMapObjectService } from './select-map-object.service';
import { EgpuResponseInterface } from '../../../../../interfaces/epgu.service.interface';
import { RestService } from '../../../../services/rest/rest.service';

@Component({
  selector: 'app-select-map-object',
  templateUrl: './select-map-object.component.html',
  styleUrls: ['./select-map-object.component.scss'],
})
export class SelectMapObjectComponent implements OnInit, OnDestroy {
  @Input() response: EgpuResponseInterface;
  @Output() nextStepEvent: EventEmitter<any> = new EventEmitter();

  public isSearchInputFocused;

  @ViewChild('yaMap', { static: false })
  yaMap: any;

  private ngUnsubscribe$ = new Subject();
  private isMapsScriptLoaded = false;
  private fiasCode;

  constructor(
    public selectMapObjectService: SelectMapObjectService,
    private yaMapService: YaMapService,
    private restService: RestService,
  ) {
    // TODO HARDCODE
    this.fiasCode =
      // constructorService.response.applicantAnswers?.pd1?.value
      '0c5b2444-70a0-4932-980c-b4dc0d3f02b5';
  }

  ngOnInit(): void {
    this.controlsLogicInit();
    this.selectMapObjectService.controlValue.subscribe((value) => {
      this.nextStepEvent.emit(value);
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private controlsLogicInit() {
    interval(1000)
      .pipe(
        filter(() => {
          return this.yaMapService.map;
        }),
        takeWhile(() => {
          return !this.isMapsScriptLoaded;
        }),
      )
      .subscribe(() => {
        this.selectMapObjectService.ymaps = (window as any).ymaps;
        this.isMapsScriptLoaded = true;
        this.restService
          .getDadataByFias(this.fiasCode)
          .pipe(
            switchMap((geoObject: any) => {
              return this.restService.getDictionary(
                'FNS_ZAGS_ORGANIZATION_AREA',
                this.getFilterOptions(geoObject.address.elements[0].kladrCode.substr(0, 2)),
              );
            }),
            switchMap((dictionary) => {
              this.selectMapObjectService.dictionary = dictionary;
              return this.selectMapObjectService.getCoordsByAddress((dictionary as any).items);
            }),
            tap((coords) => {
              this.selectMapObjectService.filteredDictionaryItems =
                this.selectMapObjectService.dictionary.items || [];
              this.selectMapObjectService.fillDictionaryItemsWithCoords(coords);
            }),
          )
          .subscribe(() => {
            this.selectMapObjectService.placeOjectsOnMap(this.yaMapService.map);
          });
      });
  }

  public search(searchString) {
    this.selectMapObjectService.searchMapObject(searchString);
  }

  public selectMapObject(mapObject) {
    this.selectMapObjectService.centeredPlaceMark(mapObject.center, mapObject.id);
  }

  /**
   * prepares options for dictionary
   * @param kladr
   */
  private getFilterOptions(kladr) {
    return {
      filter: {
        union: {
          unionKind: 'AND',
          subs: [
            {
              simple: {
                attributeName: 'SHOW_ON_MAP',
                condition: 'EQUALS',
                value: { asString: 'true' },
              },
            },
            {
              simple: {
                attributeName: 'CODE',
                condition: 'CONTAINS',
                value: { asString: `R${kladr || '77'}` },
              },
            },
            {
              simple: {
                attributeName: 'PR2',
                condition: 'EQUALS',
                value: { asString: 'true' },
              },
            },
          ],
        },
      },
    };
  }
}
