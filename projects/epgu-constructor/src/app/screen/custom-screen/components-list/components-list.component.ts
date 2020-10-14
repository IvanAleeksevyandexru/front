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
import { ComponentListToolsService } from './services/component-list-tools.service';
import { UnsubscribeService } from '../../../services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss'],
  providers: [
    ComponentListFormService,
    ComponentListToolsService,
    ComponentListRepositoryService,
    UnsubscribeService,
  ],
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
  @Input() errors: { [key: string]: string };
  @Output() changes: EventEmitter<CustomComponentOutputData>;

  constructor(
    public configService: ConfigService,
    public formService: ComponentListFormService,
    private repository: ComponentListRepositoryService,
  ) {
    this.changes = this.formService.changes;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    const components: Array<CustomComponent> = changes.components?.currentValue;
    if (components) {
      this.formService.create(components);
      this.loadRepository(components);
    }
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
}
