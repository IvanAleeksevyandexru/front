import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ListElement, PluralizePipe, ValidationShowOn } from '@epgu/epgu-lib';
import { MultipleSelectedItems } from '../../../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary.models';
import { EquipmentChoiceCategory, EquipmentChoiceItem } from '../../equipment-choice.types';

@Component({
  selector: 'epgu-constructor-equipment-category',
  templateUrl: './equipment-category.component.html',
  styleUrls: ['./equipment-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentCategoryComponent implements OnInit {
  @Input() category: EquipmentChoiceCategory;
  @Input() categoryFormGroup: FormGroup;
  @Input() concServiceTypeIds?: string[];

  itemsWithAdditionalFields: EquipmentChoiceItem[] = [];
  tipText: string;
  requiredNumbersForm: FormGroup;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  isEquipmentUnselectable = false;

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private pluralize: PluralizePipe,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setTipText();
    this.subscribeOnControlChanges();
    this.checkItemsProps();
    this.setEquipmentRequiredForService();
  }

  public getFormControl(key: string): FormControl {
    return this.categoryFormGroup.get(key) as FormControl;
  }

  private subscribeOnControlChanges(): void {
    this.getFormControl('equipment')
      .valueChanges.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: MultipleSelectedItems) => {
        if (value) {
          this.setAdditionalFormControls(value.list);
        }
      });
  }

  /**
   * Добавить/удалить текстовые поля для оборудования которому
   * при выобре нужно указать заводской или регистрационный номер
   */
  private setAdditionalFormControls(value: ListElement[]): void {
    const newValue = value
      .map((item) => item.originalItem)
      .filter(
        (item: EquipmentChoiceItem) =>
          item.attributeValues.IS_FACTORY_NUMBER_REQUIRED === 'true' ||
          item.attributeValues.IS_REG_NUMBER_REQUIRED === 'true',
      );

    if (this.itemsWithAdditionalFields.length > 0) {
      this.itemsWithAdditionalFields.forEach((item: EquipmentChoiceItem) => {
        if (!newValue.find((n: EquipmentChoiceItem) => item.value === n.value)) {
          this.removeFields(item);
        }
      });
    }

    newValue.forEach((item: EquipmentChoiceItem) => {
      if (
        !this.itemsWithAdditionalFields.find((o: EquipmentChoiceItem) => item.value === o.value)
      ) {
        this.addNewFields(item);
      }
    });

    this.itemsWithAdditionalFields = [...newValue];
    this.cdr.markForCheck();
  }

  private setTipText(): void {
    if (this.category.minAmount) {
      const { minAmount } = this.category;

      this.tipText = `Минимум ${minAmount} ${this.pluralize.transform(
        ['вариант', 'варианта', 'вариантов'],
        minAmount,
      )}`;
    }
  }

  private checkItemsProps(): void {
    const items = this.getFormControl('equipment').value;

    if (items) this.setAdditionalFormControls(items.list);
  }

  private addNewFields(item: EquipmentChoiceItem): void {
    const additionalControls: { [propName: string]: FormControl } = {};

    if (item.attributeValues.IS_FACTORY_NUMBER_REQUIRED === 'true') {
      additionalControls.factoryNumber = new FormControl(
        item.props?.factoryNumber,
        Validators.required,
      );
    }
    if (item.attributeValues.IS_REG_NUMBER_REQUIRED === 'true') {
      additionalControls.regNumber = new FormControl(item.props?.regNumber, Validators.required);
    }

    this.categoryFormGroup.setControl(item.value, this.fb.group(additionalControls));
  }

  private removeFields(item: EquipmentChoiceItem): void {
    this.categoryFormGroup.removeControl(item.value);
  }

  /**
   * Существуют виды работ для которых есть обязательное предвыбранное оборудование
   * ID таких работ указаны в concServiceTypeIds
   * Оборудование обязательно для услуги -> multiselect предзаполнен и readonly
   */
  private setEquipmentRequiredForService(): void {
    if (this.concServiceTypeIds && this.concServiceTypeIds.length > 0) {
      const preset = this.category.equipment
        .filter((item: EquipmentChoiceItem) => {
          return this.concServiceTypeIds.includes(
            String(item.attributeValues.REQUIRED_FOR_SERVICE),
          );
        })
        .map((item: EquipmentChoiceItem) => {
          return {
            id: item.value,
            originalItem: item,
            text: item.title,
            unselectable: true,
          };
        });

      if (preset.length > 0) {
        this.isEquipmentUnselectable = true;
        /**
         * Апдейтим value только если не заполнено из applicantAnswers
         */
        if (!this.getFormControl('equipment').value) {
          this.getFormControl('equipment').patchValue({
            list: preset,
            amount: preset.length,
          });
        }
      }
    }
  }
}
