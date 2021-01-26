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
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { takeUntil } from 'rxjs/operators';

import {
  FormChangeEvent,
  Full,
  PfrAreaType,
  CachedValue,
  SelectEvent,
} from '../../information-center-pfr.models';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';

@Component({
  selector: 'epgu-constructor-information-center-pfr-full',
  templateUrl: './information-center-pfr-full.component.html',
  styleUrls: ['./information-center-pfr-full.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class InformationCenterPfrFullComponent implements OnInit, OnChanges {
  @Input() items: Full;
  @Input() regionDictionary: Array<ListElement>;
  @Input() districtDictionary: Array<ListElement>;
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

    this.pfrForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((value) => {
      this.formChangeEvent.emit({
        value,
        isValid: this.pfrForm.valid,
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.territoryDictionary.currentValue.length === 1) {
      setTimeout(() => {
        this.pfrForm.get(this.pfrAreAType.territory).setValue(this.territoryDictionary[0]);
      });
    }
  }

  public handleSelect(value: ListElement, type: PfrAreaType): void {
    if ([PfrAreaType.district, PfrAreaType.territory].includes(type)) {
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
      [this.pfrAreAType.territory]: new FormControl(
        cachedValue?.territory || null,
        Validators.required,
      ),
    });
  }
}
