import {Component, Input, OnInit} from '@angular/core';
import {EgpuResponseDisplayInterface} from '../../../../interfaces/epgu.service.interface';
import {EpguService} from '../../../../../services/epgu.service';
import { ListItem } from 'epgu-lib';

enum COMPONENT_TYPE {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  ForeignCitizenship = 'ForeignCitizenship',
}

interface CustomComponentDictionaryState {
  loading: boolean,
  loadError: boolean,
  loadEnd: boolean,
  paginationLoading: boolean;
  page: number;
  data: object;
  list: Array<ListItem>;
}

@Component({
  selector: 'app-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss']
})
export class CustomScreenComponent implements OnInit {

  componentWithDictionary: { [key: string]: CustomComponentDictionaryState } = {};
  initDictionary = (key) => this.componentWithDictionary[key] = {
    loading: true, loadError: false, loadEnd: false, paginationLoading: true, page: 0, data: {}, list: []
  }
  componentType = COMPONENT_TYPE;
  _data;
  get data() {
    return this._data;
  }

  @Input() set data(val: EgpuResponseDisplayInterface) {
    this._data = val;

    this._data.components
      .filter(item => item.type === COMPONENT_TYPE.Dictionary)
      .forEach(item => {
        const loadDictionarySuccess = (key, data) => {
          this.componentWithDictionary[key].loading = false;
          this.componentWithDictionary[key].paginationLoading = false;
          this.componentWithDictionary[key].data = data;
          this.componentWithDictionary[key].list = this.adaptiveDictionaryToSelect(data);
        }

        const loadDictionaryError = (key) => {
          this.componentWithDictionary[key].loading = false;
          this.componentWithDictionary[key].paginationLoading = false;
          this.componentWithDictionary[key].loadError = true;
          this.componentWithDictionary[key].loadEnd = false;
        }

        this.initDictionary(item.attrs.dictionaryType)
        this.epguService
          .getDictionary(item.attrs.dictionaryType, {pageNum: 0})
          .subscribe(
            data => loadDictionarySuccess(item.attrs.dictionaryType, data),
            error => loadDictionaryError(item.attrs.dictionaryType)
          )
      })
  };


  constructor(private epguService: EpguService) {

  }

  ngOnInit(): void {
  }


  adaptiveDictionaryToSelect(data): Array<ListItem> {
    return data.items.map((item, index) => ({
      'id': index,
      'text': item.title,
      'hidden': false,
    }))
  }


  asdasdasd(asd) {
    console.log(asd)
  }
}
