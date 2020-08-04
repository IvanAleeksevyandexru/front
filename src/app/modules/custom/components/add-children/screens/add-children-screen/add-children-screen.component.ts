import { Component, OnInit } from '@angular/core';
import { ListItem } from 'epgu-lib';

@Component({
  selector: 'app-add-children-screen',
  templateUrl: './add-children-screen.component.html',
  styleUrls: ['./add-children-screen.component.scss'],
})
export class AddChildrenScreenComponent implements OnInit {
  listItem: Array<ListItem>;
  selectedItem: ListItem;

  constructor() {
    this.selectedItem = new ListItem('Сергей', 'Татьяна');
  }

  ngOnInit(): void {
    this.listItem = [this.selectedItem];
  }
}
