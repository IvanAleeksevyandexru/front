import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';
import { EpguService } from '../../../../../services/epgu.service';
import { CUSTOM_COMPONENT_ITEM_TYPE } from '../../tools/custom-screen-tools';
import {
  CustomComponentDictionaryState,
  EgpuResponseComponentAttrForCustomComponentInterface,
} from '../../../../interfaces/custom-component.interface';
import { DictionaryResponse } from '../../../../interfaces/dictionary-options.interface';

@Component({
  selector: 'app-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss'],
})
export class CustomScreenComponent implements OnChanges {
  // <-- constant
  componentType = CUSTOM_COMPONENT_ITEM_TYPE;
  // requestData = {};

  // <-- variables
  dictionary: { [key: string]: CustomComponentDictionaryState } = {};

  @Input() data: EgpuResponseDisplayInterface;

  constructor(private epguService: EpguService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      this.data.components
        .filter(
          (item) =>
            (item.type as CUSTOM_COMPONENT_ITEM_TYPE) === CUSTOM_COMPONENT_ITEM_TYPE.Dictionary,
        )
        .forEach((item) => {
          const dictionaryName = (item.attrs as EgpuResponseComponentAttrForCustomComponentInterface)
            .dictionaryType;
          this.initDictionary(dictionaryName);
          this.loadDictionary(dictionaryName);
        });
    }
  }

  selectDictionary(selectedItem: ListItem, dictionaryName: string) {
    this.dictionary[dictionaryName].selectedItem = selectedItem.originalItem;
    // this.requestData;
  }

  inputChange($event: any, data) {
    console.log($event, data);
  }

  loadDictionary(dictionaryName: string) {
    this.epguService.getDictionary(dictionaryName, { pageNum: 0 }).subscribe(
      (data) => this.loadDictionarySuccess(dictionaryName, data),
      () => this.loadDictionaryError(dictionaryName),
    );
  }

  loadDictionarySuccess(key: string, data: DictionaryResponse) {
    this.dictionary[key].loading = false;
    this.dictionary[key].paginationLoading = false;
    this.dictionary[key].data = data;
  }

  loadDictionaryError(key: string) {
    this.dictionary[key].loading = false;
    this.dictionary[key].paginationLoading = false;
    this.dictionary[key].loadError = true;
    this.dictionary[key].loadEnd = false;
  }

  // <------------ tools
  initDictionary(dictionaryName) {
    this.dictionary[dictionaryName] = {
      loading: true,
      loadError: false,
      loadEnd: false,
      paginationLoading: true,
      page: 0,
      data: {} as any,
      selectedItem: {} as any,
    };
  }
}
