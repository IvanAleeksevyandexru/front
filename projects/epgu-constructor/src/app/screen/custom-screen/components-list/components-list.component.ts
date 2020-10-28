import { Component, EventEmitter, OnChanges, Output, Input, SimpleChanges } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import {
  CustomListDictionaries,
  CustomComponent,
  CustomComponentOutputData,
  CustomScreenComponentTypes,
  CustomListReferenceData,
  CustomListDropDowns,
} from '../custom-screen.types';
import { OPTIONAL_FIELD } from '../../../shared/constants/helper-texts';
import { ConfigService } from '../../../config/config.service';
import { ComponentListFormService } from './services/component-list-form.service';
import { ComponentListRepositoryService } from './services/component-list-repository.service';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';
import { ScenarioErrorsDto } from '../../../services/form-player-api/form-player-api.types';
import { UtilsService as utils } from '../../../services/utils/utils.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [ComponentListFormService, ComponentListRepositoryService, UnsubscribeService],
})
export class ComponentsListComponent implements OnChanges {
  form: FormArray;
  shownElements: { [key: string]: boolean } = {};

  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.repository.dropDowns$;
  dictionaries$: BehaviorSubject<CustomListDictionaries> = this.repository.dictionaries$;

  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  readonly optionalField = OPTIONAL_FIELD;
  readonly componentType = CustomScreenComponentTypes;

  @Input() components: CustomComponent;
  @Input() errors: ScenarioErrorsDto;
  @Output() changes: EventEmitter<CustomComponentOutputData>;

  constructor(
    public configService: ConfigService,
    public formService: ComponentListFormService,
    private repository: ComponentListRepositoryService,
    private unsubscribeService: UnsubscribeService,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.unsubscribe();
    const components: Array<CustomComponent> = changes.components?.currentValue;
    if (components) {
      this.formService.create(components, this.errors);
      this.loadRepository(components);
    }
  }

  public getDictKeyByComp(component: CustomComponent): string {
    return utils.getDictKeyByComp(component);
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
}
