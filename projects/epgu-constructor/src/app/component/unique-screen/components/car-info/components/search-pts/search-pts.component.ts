import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SearchingSpec } from '../../../car-list/models/car-list.interface';

@Component({
  selector: 'epgu-constructor-search-pts',
  templateUrl: './search-pts.component.html',
  styleUrls: ['./search-pts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPtsComponent {
  @Input() searchPTS: SearchingSpec;
}
