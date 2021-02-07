import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

import { ScreenService } from '../../../../../screen/screen.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary-api/dictionary-api.service';
import {
  CachedValue,
  FormChangeEvent,
  InformationCenterPfr,
  PfrAreaType,
  SelectEvent,
  Simple,
} from '../information-center-pfr.models';
import {
  DictionaryFilters,
  DictionaryItem,
} from '../../../../shared/services/dictionary-api/dictionary-api.types';
import { DictionaryUtilities } from '../../select-map-object/dictionary-utilities';
import {
  ActionType,
  ComponentActionDto,
  DTOActionAction,
} from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';

@Component({
  selector: 'epgu-constructor-information-center-pfr',
  templateUrl: './information-center-pfr-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class InformationCenterPfrContainerComponent {
  public data$ = (this.screenService.component$ as Observable<InformationCenterPfr>).pipe(
    tap((component) => {
      if (!this.isSimpleElement(component)) {
        this.dictionaryType = component.attrs.dictionaryType;
        const { condition, attributeName } = component.attrs.full.region;
        this.fetchDictionary({
          type: PfrAreaType.region,
          attributeName,
          condition,
        });
      }

      if (!this.isSimpleElement(component) && component.value) {
        this.setCashedValue(component);
      }
    }),
    map<InformationCenterPfr, InformationCenterPfr>((component) => {
      if (!this.isSimpleElement(component)) return component;

      const { simple } = component.attrs;
      const data: Simple = {
        ...simple,
        items: DictionaryUtilities.adaptDictionaryToListItem(simple.items as Array<DictionaryItem>),
      };

      return {
        ...component,
        attrs: {
          ...component.attrs,
          simple: data,
        },
      };
    }),
  );
  public regionDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public districtDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public cityDistrictDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public territoryDictionary$ = new BehaviorSubject<Array<ListElement>>([]);
  public nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };
  private dictionaryType: string;

  constructor(
    public readonly screenService: ScreenService,
    private readonly ngUnsubscribe$: UnsubscribeService,
    private readonly dictionaryApiService: DictionaryApiService,
    private cdr: ChangeDetectorRef,
    public currentAnswersService: CurrentAnswersService,
  ) {}

  public changeForm({ isValid, value }: FormChangeEvent): void {
    this.currentAnswersService.isValid = isValid;
    this.currentAnswersService.state = JSON.stringify(value);
    this.cdr.detectChanges();
  }

  public fetchDictionary({ value, type, attributeName, condition }: SelectEvent): void {
    if (value === null) {
      this.updateDictionary(type, []);
      return;
    }

    const options = this.getInfoCenterOptionsRequest(attributeName, condition, value?.id as string);

    this.dictionaryApiService
      .getDictionary(this.dictionaryType, options)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data) => {
        const items = DictionaryUtilities.adaptDictionaryToListItem(data.items);
        this.updateDictionary(type, items);
      });
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

  private getInfoCenterOptionsRequest(
    attributeName: string,
    condition: string,
    id: string = '',
  ): DictionaryFilters {
    return {
      filter: {
        simple: {
          attributeName,
          condition,
          value: { asString: id },
        },
        tx: 'e838ab71-49dd-11eb-9135-fa163e1007b9',
      },
    };
  }

  private setCashedValue(component: InformationCenterPfr): void {
    const value = JSON.parse(component.value) as CachedValue;

    if (!value.territory) return;

    const { full } = component.attrs;

    Object.keys(value).forEach((type, index, array) => {
      if (index !== 0 && value[type]) {
        this.fetchDictionary({
          type: type as PfrAreaType,
          value: value[array[index - 1]] || value[array[index - 2]], // TODO: подумать над механизмом relation, сейчас идет перебор массива с сравнением, что не очень универсально
          condition: full[type].condition,
          attributeName: full[type].attributeName,
        });
      }
    });
  }

  private isSimpleElement(component: InformationCenterPfr): boolean {
    return component.attrs.simple.items.length === 1;
  }
}
