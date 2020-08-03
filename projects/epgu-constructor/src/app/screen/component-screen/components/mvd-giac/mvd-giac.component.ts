import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
/* eslint-disable import/no-extraneous-dependencies */
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DictionaryItem } from '../../../../../interfaces/dictionary-options.interface';
import { ComponentStateService } from '../../../../services/component-state/component-state.service';
import { FormPlayerService } from '../../../../services/form-player/form-player.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';

@Component({
  selector: 'epgu-constructor-mvd-giac',
  templateUrl: './mvd-giac.component.html',
  styleUrls: ['./mvd-giac.component.scss'],
})
export class MvdGiacComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$: Subject<any> = new Subject<any>();

  @Input() data: any;
  @Output() valueChangedEvent = new EventEmitter();

  regionForm: FormGroup;
  isLoading;

  dictionary = [];

  constructor(
    private fb: FormBuilder,
    private componentStateService: ComponentStateService,
    private formPlayerService: FormPlayerService,
    private dictionaryApiService: DictionaryApiService,
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;

    this.initForm();

    this.loadDictionary(this.data.attrs.dictionaryType);
  }

  private initForm() {
    this.regionForm = this.fb.group({
      region: this.fb.control({
        value: null,
      }),
    });

    this.regionForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((value) => {
      if (!this.regionForm.valid) {
        return;
      }

      this.componentStateService.state = value.region;
    });
  }

  private loadDictionary(dictionaryName: string) {
    this.dictionaryApiService.getDictionary(dictionaryName, { pageNum: 0 }).subscribe((data) => {
      this.dictionary = data.items.map((item) => this.adaptiveData(item));

      this.filterRegion();

      this.isLoading = false;
    });
  }

  private filterRegion() {
    // @ts-ignore
    const documentType = this.formPlayerService.responseStore.scenarioDto.applicantAnswers.q1.value;

    if (documentType !== 'Электронная справка') {
      return;
    }

    const sameAddress =
      // @ts-ignore
      this.formPlayerService.responseStore.scenarioDto.applicantAnswers.q5.value === 'Да';

    const currentRegion = JSON.parse(
      // @ts-ignore
      this.formPlayerService.responseStore.scenarioDto.applicantAnswers.pd4.value,
    ).regAddr.region;

    let checkRegion;

    if (sameAddress) {
      checkRegion = currentRegion;
    } else {
      const registrationRegion = JSON.parse(
        // @ts-ignore
        this.formPlayerService.responseStore.scenarioDto.applicantAnswers.pd5.value,
      ).regAddr.region;

      if (registrationRegion !== currentRegion) {
        return;
      }

      checkRegion = currentRegion;
    }

    if (checkRegion === 'Байконур') {
      return;
    }

    let filteredDictionary = this.dictionary.filter((item) => {
      return item.text.includes(checkRegion);
    });

    if (filteredDictionary.length === 0) {
      filteredDictionary = this.dictionary.filter((item) => {
        return item.text.includes(checkRegion.slice(0, -1));
      });
    }

    if (filteredDictionary.length === 0) {
      filteredDictionary = this.dictionary.filter((item) => {
        return item.text.includes(checkRegion.slice(0, -2));
      });
    }

    if (filteredDictionary.length !== 0) {
      this.dictionary = filteredDictionary;
    }

    if (this.dictionary.length === 1) {
      const regionControl = this.regionForm.get('region');

      regionControl.patchValue(this.dictionary[0]);
      regionControl.disable();
    }
  }

  private adaptiveData(item: DictionaryItem): any {
    return {
      id: item.value,
      text: item.title,
    };
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
