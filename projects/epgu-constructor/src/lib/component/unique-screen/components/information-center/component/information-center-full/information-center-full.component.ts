import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListElement } from '@epgu/epgu-lib';
import { startWith, takeUntil } from 'rxjs/operators';

import {
  CachedValue,
  FormChangeEvent,
  Full,
  PfrAreaType,
  SelectEvent,
} from '../../information-center.models';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-information-center-full',
  templateUrl: './information-center-full.component.html',
  styleUrls: ['./information-center-full.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class InformationCenterFullComponent implements OnInit, OnChanges {
  @Input() items: Full;
  @Input() regionDictionary: Array<ListElement>;
  @Input() districtDictionary: Array<ListElement>;
  @Input() cityDistrictDictionary: Array<ListElement>;
  @Input() territoryDictionary: Array<ListElement>;
  @Input() cachedValue: string;
  @Output() selectEvent = new EventEmitter<SelectEvent>();
  @Output() formChangeEvent = new EventEmitter<FormChangeEvent>();
  pfrForm: FormGroup;
  pfrAreAType = PfrAreaType;

  constructor(private fb: FormBuilder, private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    if (this.cachedValue) {
      this.initForm(JSON.parse(this.cachedValue));
    } else {
      this.initForm();
    }

    this.pfrForm.valueChanges
      .pipe(startWith(this.pfrForm.value), takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        this.formChangeEvent.emit({
          value,
          isValid: this.pfrForm.valid,
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.cityDistrictDictionary &&
      changes.cityDistrictDictionary?.currentValue.length !== 0 &&
      this.pfrForm
    ) {
      this.pfrForm.controls[this.pfrAreAType.cityDistrict].setValidators(Validators.required);
      this.pfrForm.controls[this.pfrAreAType.cityDistrict].updateValueAndValidity();
    } else if (changes.cityDistrictDictionary?.currentValue.length === 0 && this.pfrForm) {
      this.pfrForm.controls[this.pfrAreAType.cityDistrict].setValidators(Validators.nullValidator);
      this.pfrForm.controls[this.pfrAreAType.cityDistrict].updateValueAndValidity();
    }

    if (changes.territoryDictionary?.currentValue.length === 1 && this.pfrForm) {
      this.pfrForm.controls[this.pfrAreAType.territory].setValue(this.territoryDictionary[0]);
      this.pfrForm.controls[this.pfrAreAType.territory].updateValueAndValidity();
    }
  }

  public handleSelect(value: ListElement, type: PfrAreaType): void {
    if ([PfrAreaType.district, PfrAreaType.cityDistrict, PfrAreaType.territory].includes(type)) {
      this.pfrForm.get(type).reset();
    }

    const { attributeName, condition } = this.items[type];
    this.selectEvent.emit({
      value,
      type,
      attributeName,
      condition,
    });
  }

  private initForm(cachedValue?: CachedValue): void {
    this.pfrForm = this.fb.group({
      [this.pfrAreAType.region]: new FormControl(cachedValue?.region || null, Validators.required),
      [this.pfrAreAType.district]: new FormControl(
        cachedValue?.district || null,
        Validators.required,
      ),
      [this.pfrAreAType.cityDistrict]: new FormControl(
        cachedValue?.cityDistrict || null,
        cachedValue?.cityDistrict ? Validators.required : Validators.nullValidator,
      ),
      [this.pfrAreAType.territory]: new FormControl(
        cachedValue?.territory || null,
        Validators.required,
      ),
    });
  }
}
