import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ListItem } from 'epgu-lib';
import { FormControl } from '@angular/forms';
import {
  ActionType,
  ComponentActionDto,
  ComponentDto,
  DisplayDto,
  DTOActionAction,
} from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ServiceResult } from '../../../car-info/models/car-info.interface';
import {
  CarList,
  CarListComponentAttrsDto,
  ErrorTemplate,
  VehicleOwnerInfo,
} from '../../models/car-list.interface';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ConfigService } from '../../../../../../core/services/config/config.service';

@Component({
  selector: 'epgu-constructor-car-list-container',
  templateUrl: './car-list-container.component.html',
  styleUrls: ['./car-list-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarListContainerComponent {
  showNav$: Observable<boolean> = this.screenService.showNav$;
  isLoading$: Observable<boolean> = this.screenService.isLoading$;
  display$: Observable<DisplayDto> = this.screenService.display$;
  component$: Observable<ComponentDto> = this.screenService.component$.pipe(
    filter((component: ComponentDto) => !!component.value),
    tap((component: ComponentDto) => {
      const value = JSON.parse(component.value);

      this.carFixedItems = this.getCarFixedItems(value);
      this.initControl(this.carFixedItems?.[0]);

      const attrs = <CarListComponentAttrsDto>component.attrs;
      this.handleErrors(value, attrs);
    }),
  );

  control: FormControl;
  carFixedItems: Partial<ListItem>[];
  hasError: boolean;
  errorTemplate: ErrorTemplate;

  nextStepAction: ComponentActionDto = {
    label: 'Далее',
    action: DTOActionAction.getNextStep,
    value: '',
    type: ActionType.nextStep,
  };

  lookupSearchCaseSensitive = false;
  lookupProvider: { search: (searchString: string) => Observable<Partial<ListItem>[]> } = {
    search: (searchString): Observable<Partial<ListItem>[]> => {
      if (searchString) {
        return of(this.filterBySearchString(searchString));
      }
      return of(this.carFixedItems);
    },
  };

  constructor(
    public screenService: ScreenService,
    private currentAnswersService: CurrentAnswersService,
    public config: ConfigService,
  ) {}

  setState(carOriginalItem: VehicleOwnerInfo): void {
    if (carOriginalItem) {
      this.currentAnswersService.state = carOriginalItem;
    }
  }

  lookupFormatter = (item: ListItem): string => {
    return this.getHtmlItemTemplate(item.originalItem.originalItem);
  };

  private initControl(value: Partial<ListItem>): void {
    this.control = new FormControl({ value, disabled: false });
    this.setState(value?.originalItem);
  }

  private getCarFixedItems(value: CarList): Partial<ListItem>[] {
    return value?.vehicles?.map((vehicleInfo) => {
      return {
        id: vehicleInfo.govRegNumber,
        text: '',
        formatted: '',
        originalItem: vehicleInfo,
        compare: (): boolean => false,
      };
    });
  }

  private filterBySearchString(searchString): Partial<ListItem>[] {
    return this.carFixedItems.filter((carItemList) => {
      const pattern = new RegExp(`(${searchString})`, this.lookupSearchCaseSensitive ? 'g' : 'gi');
      const template = this.getHtmlItemTemplate(carItemList.originalItem);
      return pattern.test(this.htmlToText(template));
    });
  }

  private getHtmlItemTemplate(originalItem: VehicleOwnerInfo): string {
    return `${this.getModelMarkName(originalItem)}, <span style="white-space: nowrap">${
      originalItem?.govRegNumber
    }</span>`;
  }

  private getModelMarkName({ modelMarkName, modelName, markName }: VehicleOwnerInfo): string {
    return modelMarkName || [markName, modelName].filter((value) => !!value).join(' ');
  }

  private handleErrors(value: CarList, { errors }: CarListComponentAttrsDto): void {
    this.hasError = this.isNotFoundError(value) || this.isExternalError(value);

    if (!this.hasError) return;

    if (this.isNotFoundError(value)) {
      this.errorTemplate = errors?.NOT_FOUND_ERROR;
    }
    if (this.isExternalError(value)) {
      this.errorTemplate = errors?.EXTERNAL_SERVER_ERROR;
    }
  }

  private isNotFoundError(carList: CarList): boolean {
    return carList.vehicleServiceCallResult === ServiceResult.NOT_FOUND_ERROR;
  }

  private isExternalError(carList: CarList): boolean {
    return carList.vehicleServiceCallResult === ServiceResult.EXTERNAL_SERVER_ERROR;
  }

  private htmlToText(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body ? doc.body.textContent : '';
  }
}
