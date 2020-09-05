import { Component, Input, EventEmitter, OnInit, Output, AfterViewInit } from '@angular/core';
// @ts-ignore
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../../../services/modal/modal.service';
import { SCREEN_COMPONENT_NAME } from '../../../../../constant/global';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { ConfirmationModal } from '../../../../shared/components/confirmation-modal/confirmation-modal.interface';
import { DictionaryApiService } from '../../../../services/api/dictionary-api/dictionary-api.service';
import { OPTIONAL_FIELD } from '../../../../../constant/helperTexts';

interface WarningMessages {
  [countryType: number]: string;
}

interface Country {
  id: string;
  text: string;
  countryType: string;
}

@Component({
  selector: 'epgu-constructor-country-selection',
  templateUrl: './country-selection.component.html',
  styleUrls: ['./country-selection.component.scss'],
})
export class CountrySelectionComponent implements OnInit, AfterViewInit {
  listItemDictionary: Country[];
  placeholder = 'Выберите страну';
  screenComponentName = SCREEN_COMPONENT_NAME;
  selectedCountry: Country;
  helperText: string;

  @Input() data: any;
  @Input() form: FormGroup;

  @Output() changeComponentSettings = new EventEmitter();
  @Output() changeComponentData = new EventEmitter();

  warningMessages: WarningMessages = {
    2:
      'Для выбранного государства апостилирование документов не проводится.' +
      ' Обратитесь в консульство этого государства за консультацией',
    3:
      'Согласно <a class="country-apostil__minsk-convention-link">Минской конвенции</a>' +
      ' апостилирование документов <b>не требуется для:</b>' +
      ' Азербайджана, Армении, Беларуси, Грузии, Казахстана, Киргизии, Молдовы,' +
      ' России, Таджикистана, Туркменистана, Узбекистана, Украины',
  };

  minskConvention =
    '<div style="text-align: center"> Минская конвенция от 22 января 1993 года' +
    ' утверждает, что документы одного государства принимаются на территории другого' +
    ' государства без специального удостоверения</div> <br> <br>Перечень государств:' +
    '<br>Азербайджанская Республика<br>Республика Армения<br>Республика Белорусия<br>' +
    'Грузия<br>Республика Казахстан<br>Киргизская Республика<br>Республика Молдавия<br>' +
    'Российская Федерация<br>Туркменистан<br>Республика Таджикистан<br>Республика Узбекистан' +
    '<br>Украина';

  modalParameters: ConfirmationModal = {
    text: this.minskConvention,
  };

  constructor(
    private dictionaryApiService: DictionaryApiService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.dictionaryApiService
      .getDictionary(this.data.attrs.dictionaryType)
      .subscribe((dictionary) => {
        this.mapToListItemModel(dictionary.items);
      });
    this.form.addControl('countryDropdown', new FormControl('', [Validators.required]));
    this.updateHelperText();
  }

  ngAfterViewInit() {
    // document
    //   .getElementsByClassName('country-apostil__minsk-convention-link')[0]
    //   .addEventListener('click', this.showModal);
  }

  mapToListItemModel(dictionary): void {
    this.listItemDictionary = dictionary.map((item) => ({
      id: item.value,
      text: item.title,
      countryType: item.attributeValues.CHECK_APOSTIL,
    }));
  }

  selectCountry(country): void {
    this.selectedCountry = country;
    const hasWarning = country.countryType !== '1';
    this.changeComponentSettings.emit({
      displayWarningAnswers: hasWarning,
      displayContinueBtn: !hasWarning,
    });
    this.changeComponentData.emit(country.id);
  }

  updateHelperText(): void {
    this.helperText = this.data.required ? '' : OPTIONAL_FIELD;
  }

  clickToInnerHTML($event: MouseEvent) {
    const targetElementClass = ($event.target as HTMLElement).classList[0];
    if (targetElementClass === 'country-apostil__minsk-convention-link') {
      this.showModal();
    }
  }

  showModal() {
    this.modalService.openModal(ConfirmationModalComponent, this.modalParameters);
  }
}
