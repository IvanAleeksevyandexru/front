import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ListItem } from 'epgu-lib';
import { EgpuResponseDisplayInterface } from '../../../../../../interfaces/epgu.service.interface';

@Component({
  selector: 'app-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  listItem: Array<ListItem>;
  selectedItem: ListItem;
  sectionId = 1;
  @Input() data: EgpuResponseDisplayInterface;
  @Input() header: string;
  @Output() nextStepEvent = new EventEmitter();

  headerMapped: any;

  constructor() {
    this.selectedItem = new ListItem({ id: 1, text: 'Сергей' });
  }

  ngOnInit(): void {
    this.listItem = [this.selectedItem];
    this.headerMapped = {
      1: this.header,
      2: 'Свидетельство о рождении',
      3: `Кем вы приходитесь ребенку? (<span>${this.selectedItem.text}</span>)`,
      4: 'Адрес постоянной регистрации ребенка',
    };
  }

  nextStep() {
    this.sectionId += 1;
  }
}
