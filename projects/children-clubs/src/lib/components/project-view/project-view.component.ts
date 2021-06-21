import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'children-clubs-project-view-page',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewComponent {}
