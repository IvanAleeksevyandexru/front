import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Project } from '../../typings';
import data from '../../stubs/projects.stub';

@Component({
  selector: 'children-clubs-project-view-page',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewComponent {
  data: Project = data[0];
}
