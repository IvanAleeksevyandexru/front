import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListItem } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { CurrentAnswersService } from '../../../current-answers.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { getMvdGiasForUserAddress, getSortUserMvdGias } from './mvd-giac.functions';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../services/api/dictionary-api/dictionary-api.types';
import { CachedAnswers } from '../../../screen.types';
import { DictionaryUtilities } from '../../../../shared/services/dictionary/dictionary-utilities-service';

@Component({
  selector: 'epgu-constructor-mvd-giac',
  templateUrl: './mvd-giac.component.html',
  styleUrls: ['./mvd-giac.component.scss'],
  providers: [UnsubscribeService],
})
export class MvdGiacComponent implements OnInit {
  @Input() data: any;
  @Input() applicantAnswers: CachedAnswers;
  @Output() valueChangedEvent = new EventEmitter();

  regionForm: FormGroup;
  isLoading;

  dictionary: Array<Partial<ListItem>> = [];

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
      .pipe(takeUntil(this.ngUnsubscribe$))
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
    this.initDictionary(data.items);
    this.isLoading = false;
  }

  initDictionary(items: Array<DictionaryItem>) {
    const dictionary = DictionaryUtilities.adaptDictionaryToListItem(items);
    this.dictionary = getMvdGiasForUserAddress(dictionary, this.applicantAnswers as any);
    if (this.dictionary.length === 1) {
      this.setOneRegion(this.dictionary[0]);
    } else {
      this.dictionary = getSortUserMvdGias(this.dictionary, this.applicantAnswers as any);
    }
  }

  private setOneRegion(region: Partial<ListItem>) {
    const regionControl = this.regionForm.get('region');
    regionControl.patchValue(region);
    regionControl.disable();
  }
}
