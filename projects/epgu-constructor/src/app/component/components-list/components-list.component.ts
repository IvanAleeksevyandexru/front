import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationShowOn } from 'epgu-lib';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfigService } from '../../core/config/config.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ScenarioErrorsDto } from '../../form-player/services/form-player-api/form-player-api.types';
import { OPTIONAL_FIELD } from '../../shared/constants/helper-texts';
import { DateRangeService } from './services/date-range/date-range.service';
import { UtilsService as utils } from '../../core/services/utils/utils.service';
import {
  CustomComponent,
  CustomComponentOutputData,
  CustomListDictionaries,
  CustomListDropDowns,
  CustomListReferenceData,
  CustomScreenComponentTypes,
} from './components-list.types';
import { ComponentListFormService } from './services/component-list-form/component-list-form.service';
import { ComponentListRepositoryService } from './services/component-list-repository/component-list-repository.service';

const halfWidthItemTypes = [
  CustomScreenComponentTypes.NewEmailInput,
  CustomScreenComponentTypes.PhoneNumberChangeInput,
];

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [
    ComponentListFormService,
    ComponentListRepositoryService,
    UnsubscribeService,
    DateRangeService,
  ],
})
export class ComponentsListComponent implements OnChanges {
  shownElements: { [key: string]: boolean } = {};

  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.repository.dropDowns$;
  dictionaries$: BehaviorSubject<CustomListDictionaries> = this.repository.dictionaries$;

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;

  @Input() components: CustomComponent;
  @Input() errors: ScenarioErrorsDto;
  @Output() changes: EventEmitter<CustomComponentOutputData>;
  @Output() emitFormStatus = new EventEmitter();

  constructor(
    public configService: ConfigService,
    public formService: ComponentListFormService,
    public dateRangeService: DateRangeService,
    private repository: ComponentListRepositoryService,
    private unsubscribeService: UnsubscribeService,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.unsubscribe();
    const components: Array<CustomComponent> = changes.components?.currentValue;
    if (components) {
      this.formService.create(components, this.errors);
      this.subscribeOnFormStatusChanging();
      this.loadRepository(components);
    }
  }

  private subscribeOnFormStatusChanging(): void {
    if (this.emitFormStatus.observers.length) {
      this.emitFormStatus.emit(this.formService.form.status);
      this.formService.form.statusChanges
        .pipe(takeUntil(this.unsubscribeService.ngUnsubscribe$))
        .subscribe((formStatus) => this.emitFormStatus.emit(formStatus));
    }
  }

  public getDictKeyByComp(component: CustomComponent): string {
    return utils.getDictKeyByComp(component);
  }

  public isHalfWidthItem(componentData: AbstractControl): boolean {
    return halfWidthItemTypes.includes(componentData.value?.type);
  }

  private loadRepository(components: Array<CustomComponent>): void {
    this.repository
      .loadReferenceData$(components)
      .subscribe((references: Array<CustomListReferenceData>) => {
        references.forEach((reference: CustomListReferenceData) => {
          setTimeout(() => this.formService.patch(reference.component), 0);
          this.formService.emmitChanges();
        });
      });
  }

  private unsubscribe(): void {
    this.unsubscribeService.ngUnsubscribe$.next();
    this.unsubscribeService.ngUnsubscribe$.complete();
  }

  public emmitChanges(): void {
    this.formService.emmitChanges();
  }
}
