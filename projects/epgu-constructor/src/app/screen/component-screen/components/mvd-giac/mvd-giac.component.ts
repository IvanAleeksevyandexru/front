import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { filter, takeUntil } from 'rxjs/operators';
import { CurrentAnswersService } from '../../../current-answers.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import {
  getFilteredDictionaryForMvdGiac,
  getTransformedDictionaryForMvgGiac,
} from './mvd-giac.functions';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { DictionaryResponse } from '../../../../services/api/dictionary-api/dictionary-api.types';
import { ApplicantAnswers } from '../../../screen.types';

@Component({
  selector: 'epgu-constructor-mvd-giac',
  templateUrl: './mvd-giac.component.html',
  styleUrls: ['./mvd-giac.component.scss'],
  providers: [UnsubscribeService],
})
export class MvdGiacComponent implements OnInit {
  @Input() data: any;
  @Input() applicantAnswers: ApplicantAnswers;
  @Output() valueChangedEvent = new EventEmitter();

  regionForm: FormGroup;
  isLoading;

  dictionary = [];

  constructor(
    private fb: FormBuilder,
    private currentAnswersService: CurrentAnswersService,
    private dictionaryApiService: DictionaryApiService,
    private ngUnsubscribe$: UnsubscribeService,
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.initForm();
    this.loadDictionary(this.data.attrs.dictionaryType);
  }

  private initForm() {
    this.regionForm = this.getRegionGroupForm();
    this.subscribeFormChanges();
  }

  private subscribeFormChanges() {
    this.regionForm.valueChanges
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        filter(() => this.regionForm.valid),
      )
      .subscribe((value) => this.formChangesHandler(value));
  }

  private formChangesHandler(value) {
    this.currentAnswersService.state = value.region;
  }

  private getRegionGroupForm() {
    return this.fb.group({
      region: this.fb.control({
        value: null,
      }),
    });
  }

  private loadDictionary(dictionaryName: string) {
    this.dictionaryApiService
      .getMvdDictionary(dictionaryName, { pageNum: 0 })
      .subscribe((data) => this.loadDictionarySuccess(data));
  }

  private loadDictionarySuccess(data: DictionaryResponse) {
    this.dictionary = getTransformedDictionaryForMvgGiac(data);
    this.filterRegion();
    this.isLoading = false;
  }

  private filterRegion() {
    const { q1, q5, pd4, pd5 } = this.applicantAnswers;
    // <--- значение предыдущих экранов
    const getCurrentRegion = () => JSON.parse(pd4.value).regAddr.region;
    const getRegistrationRegion = () => JSON.parse(pd5.value).regAddr.region;
    const getDocumentType = () => q1.value;
    const isSameAddress = () => q5.value === 'Да';
    // <--- проверки
    const isSameRegion = () => getRegistrationRegion() !== getCurrentRegion();
    const isBaykanur = () => getCurrentRegion() === 'Байконур';
    const isRegionDifferent = () => !isSameAddress() && isSameRegion();
    const isWebDoc = getDocumentType() === 'Электронная справка';

    if (!isWebDoc || isRegionDifferent() || isBaykanur()) {
      return;
    }

    const filteredDictionary = getFilteredDictionaryForMvdGiac(this.dictionary, getCurrentRegion());

    if (filteredDictionary) {
      this.dictionary = filteredDictionary;
    }

    if (this.dictionary.length === 1) {
      this.setOneRegion(this.dictionary[0]);
    }
  }

  private setOneRegion(region: ListItem) {
    const regionControl = this.regionForm.get('region');
    regionControl.patchValue(region);
    regionControl.disable();
  }
}
