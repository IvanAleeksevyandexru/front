import { Component /* , OnInit */ } from '@angular/core';
import { ListItem } from 'epgu-lib';

@Component({
  selector: 'app-add-new-child-form',
  templateUrl: './add-new-child-form.component.html',
  styleUrls: ['./add-new-child-form.component.scss'],
})
export class AddNewChildFormComponent /*  implements OnInit */ {
  list: Array<ListItem> = [
    {
      id: 1,
      text: 'Сергей',
      formatted: 'Сергей',
      originalItem: 'Сергей',
      compare: () => true,
    },
    {
      id: 2,
      text: 'Тамара',
      formatted: 'Тамара',
      originalItem: 'Тамара',
      compare: () => true,
    },
  ];
  // constructor() {}

  // ngOnInit(): void {}
}
