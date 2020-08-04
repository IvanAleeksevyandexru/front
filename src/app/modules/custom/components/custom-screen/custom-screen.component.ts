import {Component, Input, OnInit} from '@angular/core';
import {EpguService} from '../../../../../services/epgu.service';

enum COMPONENT_TYPE {
  LabelSection = 'LabelSection',
  Dictionary = 'Dictionary',
  ForeignCitizenship = 'ForeignCitizenship',
}

@Component({
  selector: 'app-custom-screen',
  templateUrl: './custom-screen.component.html',
  styleUrls: ['./custom-screen.component.scss']
})
export class CustomScreenComponent implements OnInit {

  componentType = COMPONENT_TYPE;

  @Input('data') arrayComponent = [
    {
      "id": "lg9",
      "type": "LabelSection",
      "label": "Сведения о гражданстве",
      "attrs": {},
      "value": "",
      "visited": false
    },
    {
      "id": "pd10",
      "type": "Dictionary",
      "label": "Гражданство",
      "attrs": {
        "dictionaryType": "DOC_TYPE_56555",
        "requiredAttrs": ["regionId", "code", "fullName"],
        "labelAttr": "fullName",
        "ref": []
      },
      "value": "",
      "visited": false
    },
    {
      "id": "pd12",
      "type": "ForeignCitizenship",
      "label": "Было ли у вас раньше гражданство другого государства",
      "attrs": {"displayFields": ["country", "date"]},
      "value": "",
      "visited": false
    },
    {
      "id": "pd24",
      "type": "Dictionary",
      "label": "Гражданство-связанное",
      "attrs": {
        "dictionaryType": "DOC_TYPE_56",
        "requiredAttrs": ["regionId", "code", "fullName"],
        "labelAttr": "fullName",
        "ref": []
      },
      "value": "",
      "visited": false
    },
  ]

  sasdas = [{
    id: 1,
    text: 'one',
    hidden: false,
    originalItem: '123',
  },
    {
      id: 2,
      text: 'twi',
      hidden: false,
      originalItem: '123',
    },
    {
      id: 3,
      text: 'tree',
      hidden: false,
      originalItem: '123',
    },
  ]


  constructor(private epguService: EpguService) {
    // this.epguService.getDictionary('regions_56555').subscribe(data => console.log(data));
    this.epguService.getDictionary('OKATO', {parentRefItemValue: '00000000000'}).subscribe(data => console.log(data));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.sasdas.push({
        id: 5,
        text: 'for',
        hidden: false,
        originalItem: '123',
      },{
        id: 5,
        text: 'five',
        hidden: false,
        originalItem: '123',
      },{
        id: 6,
        text: 'six',
        hidden: false,
        originalItem: '123',
      })
    }, 3000)

  }

}
