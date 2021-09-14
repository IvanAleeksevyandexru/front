import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { ComponentDto } from '@epgu/epgu-constructor-types';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import {
  EquipmentChoiceRequestResult,
  EquipmentChoiceFormValue,
  EquipmentChoiceUpdateEvent,
  EquipmentChoiceCategory,
} from '../../equipment-choice.types';

@Component({
  selector: 'epgu-constructor-equipment-choice',
  templateUrl: './equipment-choice.component.html',
  styleUrls: ['./equipment-choice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentChoiceComponent implements OnInit {
  @Input() component: ComponentDto;
  @Input() cachedValue: string;
  @Output() updateEvent = new EventEmitter<EquipmentChoiceUpdateEvent>();

  equipmentForm: FormGroup;
  equipmentChoiceRequestResult: EquipmentChoiceRequestResult;
  concServiceTypeIds: string[];
  isFormReady = false;

  constructor(private ngUnsubscribe$: UnsubscribeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.equipmentChoiceRequestResult = new EquipmentChoiceRequestResult(
      this.component?.attrs?.result,
    );
    this.concServiceTypeIds =
      (this.equipmentChoiceRequestResult.attrs?.CONC_SERVICE_TYPE_IDS as string[]) || [];

    this.initForm();
    this.setValue();
    this.isFormReady = true;
    this.equipmentForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  public getFormGroup(key: string): FormGroup {
    return this.equipmentForm.get(key) as FormGroup;
  }

  private initForm(): void {
    this.equipmentForm = new FormGroup({});
    if (this.isCategoryListNotEmpty()) {
      Object.keys(this.equipmentChoiceRequestResult.categories).forEach((key: string) => {
        this.equipmentForm.setControl(
          key,
          new FormGroup({
            equipment: new FormControl(
              null,
              this.validateMinAmount(this.equipmentChoiceRequestResult.categories[key]),
            ),
          }),
        );
      });
      this.subscribeFormChanges();
    }
  }

  private subscribeFormChanges(): void {
    this.equipmentForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((change) => {
      this.updateEvent.emit({ value: change, isValid: this.equipmentForm.valid });
    });
  }

  private isCategoryListNotEmpty(): boolean {
    return Object.keys(this.equipmentChoiceRequestResult.categories).length > 0;
  }

  private setValue(): void {
    if (this.cachedValue) {
      this.equipmentForm.patchValue(new EquipmentChoiceFormValue(this.cachedValue));
    }
  }

  private validateMinAmount(category: EquipmentChoiceCategory): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      if ((category.minAmount && !control.value) || control.value?.amount < category.minAmount) {
        return { insufficient: true };
      }
      return null;
    };
  }
}
