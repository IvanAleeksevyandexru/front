import {Component, Input, OnInit} from '@angular/core';
import { EgpuResponseDisplayInterface } from '../../../../interfaces/epgu.service.interface';
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
  @Input() data: EgpuResponseDisplayInterface;


  constructor(private epguService: EpguService) {
    // this.epguService.getDictionary('regions_56555').subscribe(data => console.log(data));
    this.epguService.getDictionary('OKATO', {parentRefItemValue: '00000000000'}).subscribe(data => console.log(data));
  }

  ngOnInit(): void {
  }

}
