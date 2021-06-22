import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'children-clubs-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListComponent {}
