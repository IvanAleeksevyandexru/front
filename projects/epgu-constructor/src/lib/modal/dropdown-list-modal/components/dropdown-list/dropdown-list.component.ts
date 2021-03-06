import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DropdownListItem } from '../../dropdown-list.types';

@Component({
  selector: 'epgu-constructor-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownListComponent {
  @Input() items: DropdownListItem[];
  searchControl = new FormControl('');
}
