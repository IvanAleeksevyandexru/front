import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'children-clubs-project-list-page',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent {}
