import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  CachedValue,
  FormChangeEvent,
  InformationCenterPfr,
  PfrAreaType,
  SelectEvent,
  Simple,
} from '../information-center-pfr.models';
import { ComponentActionDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { NEXT_STEP_ACTION } from '../../../../../shared/constants/actions';
import { SopService } from '../../../../../shared/services/sop/sop.service';
import { SopItem } from '../../../../../shared/services/sop/sop.types';

@Component({
  selector: 'epgu-constructor-information-center-pfr',
  templateUrl: './information-center-pfr-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class InformationCenterPfrContainerComponent {
  public data$ = (this.screenService.component$ as Observable<InformationCenterPfr>).pipe(
    tap((component) => this.initDictionary(component)),
    map<InformationCenterPfr, InformationCenterPfr>((component) => this.initComponent(component)),
  );
  public regionDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public districtDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public cityDistrictDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public territoryDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public nextStepAction: ComponentActionDto = NEXT_STEP_ACTION;

  constructor(
    public readonly screenService: ScreenService,
    private readonly ngUnsubscribe$: UnsubscribeService,
    private readonly sopService: SopService,
    private cdr: ChangeDetectorRef,
    public currentAnswersService: CurrentAnswersService,
  ) {}

  public changeForm({ isValid, value }: FormChangeEvent): void {
    this.currentAnswersService.isValid = isValid;
    this.currentAnswersService.state = JSON.stringify(value);
    this.cdr.detectChanges();
  }

  public fetchDictionary({ value, type, options }: SelectEvent): void {
    if (value === null) {
      this.updateDictionary(type, []);
      return;
    }

    this.sopService
      .getDictionary(options, value, this.screenService.getStore())
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        this.updateDictionary(type, data.items);
      });
  }

  public isSimpleElement(component: InformationCenterPfr): boolean {
    return component.attrs.simple.items.length === 1;
  }

  private initDictionary(component: InformationCenterPfr): void {
    if (this.isSimpleElement(component)) return;

    if (component.value) {
      this.setCashedValue(component);
    } else {
      this.fetchDictionary({
        type: PfrAreaType.region,
        options: component.attrs.full.region,
      });
    }
  }

  private initComponent(component: InformationCenterPfr): InformationCenterPfr {
    if (!this.isSimpleElement(component)) return component;

    const { simple } = component.attrs;
    const data: Simple = {
      ...simple,
      items: this.sopService.adaptResponseToListItem(simple.items as Array<SopItem>),
    };

    return {
      ...component,
      attrs: {
        ...component.attrs,
        simple: data,
      },
    };
  }

  private updateDictionary(type: PfrAreaType, items: Array<ListElement>): void {
    switch (type) {
      case PfrAreaType.region:
        this.territoryDictionary$.next([]);
        this.districtDictionary$.next([]);
        this.cityDistrictDictionary$.next([]);
        this.regionDictionary$.next(items);
        break;
      case PfrAreaType.district:
        this.territoryDictionary$.next([]);
        this.cityDistrictDictionary$.next([]);
        this.districtDictionary$.next(items);
        break;
      case PfrAreaType.cityDistrict:
        if (items.length !== 1) {
          this.cityDistrictDictionary$.next(items);
          this.territoryDictionary$.next([]);
        } else {
          this.cityDistrictDictionary$.next([]);
          this.territoryDictionary$.next(items);
        }
        break;
      case PfrAreaType.territory:
        this.territoryDictionary$.next(items);
        break;
      default:
        break;
    }
  }

  private updateDictionaryFromCache(type: PfrAreaType, items: Array<ListElement>): void {
    switch (type) {
      case PfrAreaType.region:
        this.regionDictionary$.next(items);
        break;
      case PfrAreaType.district:
        this.districtDictionary$.next(items);
        break;
      case PfrAreaType.cityDistrict:
        if (items.length !== 1) {
          this.cityDistrictDictionary$.next(items);
          this.territoryDictionary$.next([]);
        } else {
          this.cityDistrictDictionary$.next([]);
          this.territoryDictionary$.next(items);
        }
        break;
      case PfrAreaType.territory:
        this.territoryDictionary$.next(items);
        break;
      default:
        break;
    }
  }

  private setCashedValue(component: InformationCenterPfr): void {
    const value = JSON.parse(component.value) as CachedValue;

    if (!value.territory) return;

    const { full } = component.attrs;

    const data: SelectEvent[] = [];
    Object.keys(value).forEach((type, index, array) => {
      if (index === 0) {
        data.push({
          type: type as PfrAreaType,
          options: full[type],
        });
      } else if (index !== 0 && value[type]) {
        data.push({
          type: type as PfrAreaType,
          value: value[array[index - 1]] || value[array[index - 2]],
          options: full[type],
        });
      }
    });

    forkJoin(
      data.map((item) =>
        this.sopService.getDictionary(item.options, item.value, this.screenService.getStore()),
      ),
    ).subscribe((response) => {
      response.forEach(({ items }, index) => {
        this.updateDictionaryFromCache(data[index].type, items);
      });
    });
  }
}
