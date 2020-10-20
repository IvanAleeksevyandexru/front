import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ListItem, ValidationShowOn } from 'epgu-lib';
import { takeUntil } from 'rxjs/operators';
import { CurrentAnswersService } from '../../../current-answers.service';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import {
  getAnswerFromPreviousPageForMvdGias,
  getMvdGiasForUserAddress,
  sortUserMvdGias,
} from './mvd-giac.functions';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import {
  DictionaryItem,
  DictionaryResponse,
} from '../../../../services/api/dictionary-api/dictionary-api.types';
import { DictionaryUtilities } from '../../../../shared/services/dictionary/dictionary-utilities-service';
import { ScreenService } from '../../../screen.service';
import { ComponentDto } from '../../../../services/api/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-mvd-giac',
  templateUrl: './mvd-giac.component.html',
  styleUrls: ['./mvd-giac.component.scss'],
  providers: [UnsubscribeService],
})
export class MvdGiacComponent implements OnChanges {
  dictionary: Array<Partial<ListItem>> = [];
  regionControl: FormControl;
  validationShowOn = ValidationShowOn;
  isLoading = true;

  @Input() data: ComponentDto;
  recalculateForm = () => this.regionControl.updateValueAndValidity();

  constructor(
    private currentAnswersService: CurrentAnswersService,
    private dictionaryApiService: DictionaryApiService,
    private ngUnsubscribe$: UnsubscribeService,
    public screenService: ScreenService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.initFormControl(changes?.data?.currentValue);
      this.subscribeFormValueChanges();
      this.recalculateForm();
      this.loadDictionary(changes?.data?.currentValue.attrs.dictionaryType);
    }
  }

  private subscribeFormValueChanges(): void {
    this.regionControl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => this.formValueChanges(value));
  }

  private formValueChanges(value): void {
    this.currentAnswersService.state = value;
    this.currentAnswersService.isValid = this.regionControl.valid;
  }

  private initFormControl(component: ComponentDto): void {
    const getRequiredValidator = () => (component.required ? Validators.required : null);
    this.regionControl = new FormControl(component.value, getRequiredValidator());
  }

  private loadDictionary(dictionaryName: string): void {
    this.dictionaryApiService
      .getMvdDictionary(dictionaryName, { pageNum: 0 })
      .subscribe((data) => this.loadDictionarySuccess(data));
  }

  private loadDictionarySuccess(data: DictionaryResponse): void {
    this.dictionary = this.getDictionary(data.items);
    if (this.dictionary.length === 1) {
      this.setOneRegion(this.dictionary[0].text);
    }
    this.isLoading = false;
  }

  getDictionary(items: Array<DictionaryItem>): Array<Partial<ListItem>> {
    const userAnswers = getAnswerFromPreviousPageForMvdGias(this.screenService.applicantAnswers);
    const { isAddressSame, regRegion, factRegion } = userAnswers;
    const newItems = DictionaryUtilities.adaptDictionaryToListItem(items);
    const dictionary = getMvdGiasForUserAddress(newItems, regRegion, factRegion, isAddressSame);
    const getSortedMvdDic = () => sortUserMvdGias(dictionary, regRegion, factRegion);

    return dictionary.length > 2 ? getSortedMvdDic() : dictionary;
  }

  private setOneRegion(region: string) {
    this.regionControl.patchValue(region);
    this.regionControl.disable();
  }
}
